import type { NormalizedLandmarkList } from '@mediapipe/pose'
import type { PoseDeviationCounts, PoseFeedback } from '../types'

export interface PoseBaseline {
  shoulderY: number
  noseShoulderOffset: number
  shoulderHipOffset: number | null
  tolerance: {
    shoulderY: number
    noseShoulder: number
    shoulderHip: number
  }
}

export class SmoothingBuffer {
  private frames: NormalizedLandmarkList[] = []
  private readonly maxSize: number

  constructor(maxSize = 5) {
    this.maxSize = maxSize
  }

  push(landmarks: NormalizedLandmarkList): NormalizedLandmarkList | null {
    this.frames.push(landmarks)
    if (this.frames.length > this.maxSize) this.frames.shift()
    if (this.frames.length < 3) return null

    const pointCount = this.frames[0]?.length ?? 0
    const smoothed = Array.from({ length: pointCount }, (_, index) => {
      let weightSum = 0
      let x = 0
      let y = 0
      let z = 0

      for (const frame of this.frames) {
        const landmark = frame[index]
        if (!landmark) continue
        const weight = Math.max(landmark.visibility ?? 1, 0.05)
        x += landmark.x * weight
        y += landmark.y * weight
        z += landmark.z * weight
        weightSum += weight
      }

      const fallback = this.frames[this.frames.length - 1]?.[index]
      if (!weightSum || !fallback) return fallback
      return {
        ...fallback,
        x: x / weightSum,
        y: y / weightSum,
        z: z / weightSum,
        visibility: fallback.visibility,
      }
    })

    return smoothed.filter(Boolean) as NormalizedLandmarkList
  }

  reset() {
    this.frames = []
  }
}

const visible = (landmarks: NormalizedLandmarkList, indexes: number[]) =>
  indexes.every((index) => {
    const landmark = landmarks[index]
    return landmark && (landmark.visibility ?? 1) > 0.45
  })

const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length
const std = (values: number[], average: number) =>
  Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length)

export const canAnalyzePose = (landmarks: NormalizedLandmarkList) => visible(landmarks, [0, 11, 12])
const hasHips = (landmarks: NormalizedLandmarkList) => visible(landmarks, [23, 24])

export const createBaseline = (frames: NormalizedLandmarkList[]): PoseBaseline | null => {
  const usable = frames.filter(canAnalyzePose)
  if (usable.length < 8) return null

  const shoulderYs: number[] = []
  const noseShoulderOffsets: number[] = []
  const shoulderHipOffsets: number[] = []

  for (const landmarks of usable) {
    const leftShoulder = landmarks[11]
    const rightShoulder = landmarks[12]
    const nose = landmarks[0]
    const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2
    const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2

    shoulderYs.push(shoulderCenterY)
    noseShoulderOffsets.push(nose.x - shoulderCenterX)

    if (hasHips(landmarks)) {
      const leftHip = landmarks[23]
      const rightHip = landmarks[24]
      const hipCenterX = (leftHip.x + rightHip.x) / 2
      shoulderHipOffsets.push(shoulderCenterX - hipCenterX)
    }
  }

  const shoulderY = mean(shoulderYs)
  const noseShoulderOffset = mean(noseShoulderOffsets)
  const shoulderHipOffset = shoulderHipOffsets.length > 0 ? mean(shoulderHipOffsets) : null
  const shoulderHipStd = shoulderHipOffsets.length > 1 && shoulderHipOffset !== null ? std(shoulderHipOffsets, shoulderHipOffset) : 0.05

  return {
    shoulderY,
    noseShoulderOffset,
    shoulderHipOffset,
    tolerance: {
      shoulderY: Math.max(std(shoulderYs, shoulderY) * 2.5, 0.03),
      noseShoulder: Math.max(std(noseShoulderOffsets, noseShoulderOffset) * 2.5, 0.04),
      shoulderHip: Math.max(shoulderHipStd * 2.5, 0.05),
    },
  }
}

export const analyzePose = (
  landmarks: NormalizedLandmarkList | null,
  baseline: PoseBaseline | null,
): PoseFeedback => {
  const empty = { shoulderShrug: 0, slouch: 0, forwardHead: 0 }
  if (!landmarks || !canAnalyzePose(landmarks)) {
    return { level: 'idle', label: '等待肩颈识别', detail: '请后退一点，让头部和双肩进入画面。', deviations: empty }
  }
  if (!baseline) {
    return { level: 'idle', label: '校准中', detail: '已看到肩颈，正在采集自然站姿。', deviations: empty }
  }

  const nose = landmarks[0]
  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2
  const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2
  const noseShoulderOffset = nose.x - shoulderCenterX

  let slouch = 0
  if (baseline.shoulderHipOffset !== null && hasHips(landmarks)) {
    const leftHip = landmarks[23]
    const rightHip = landmarks[24]
    const hipCenterX = (leftHip.x + rightHip.x) / 2
    const shoulderHipOffset = shoulderCenterX - hipCenterX
    slouch = Math.abs(shoulderHipOffset - baseline.shoulderHipOffset) > baseline.tolerance.shoulderHip ? 1 : 0
  }

  const deviations: PoseDeviationCounts = {
    shoulderShrug: shoulderCenterY < baseline.shoulderY - baseline.tolerance.shoulderY ? 1 : 0,
    slouch,
    forwardHead: Math.abs(noseShoulderOffset - baseline.noseShoulderOffset) > baseline.tolerance.noseShoulder ? 1 : 0,
  }

  const active = Object.values(deviations).filter(Boolean).length
  if (!active) return { level: 'good', label: '姿势良好', detail: '肩颈线条稳定，继续保持当前节奏。', deviations }

  const detail = [
    deviations.forwardHead ? '头部前倾，轻轻收下巴向后移' : '',
    deviations.shoulderShrug ? '肩膀上提，呼气沉肩放松' : '',
    deviations.slouch ? '躯干偏移，胸口打开并站稳' : '',
  ].filter(Boolean).join('；')

  return { level: active >= 2 ? 'bad' : 'warn', label: active >= 2 ? '需要调整' : '略有偏差', detail, deviations }
}
