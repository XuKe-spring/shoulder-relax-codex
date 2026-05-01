import type { NormalizedLandmarkList } from '@mediapipe/pose'
import type { PoseDeviationCounts, PoseFeedback } from '../types'

export interface PoseBaseline {
  shoulderY: number
  noseShoulderOffset: number
  shoulderHipOffset: number | null
}

const visible = (landmarks: NormalizedLandmarkList, indexes: number[]) =>
  indexes.every((index) => {
    const landmark = landmarks[index]
    return landmark && (landmark.visibility ?? 1) > 0.4
  })

export const canAnalyzePose = (landmarks: NormalizedLandmarkList) => visible(landmarks, [0, 11, 12])
const hasHips = (landmarks: NormalizedLandmarkList) => visible(landmarks, [23, 24])

export const createBaseline = (frames: NormalizedLandmarkList[]): PoseBaseline | null => {
  const usable = frames.filter(canAnalyzePose)
  if (!usable.length) return null

  let hipFrameCount = 0
  const totals = usable.reduce(
    (acc, landmarks) => {
      const leftShoulder = landmarks[11]
      const rightShoulder = landmarks[12]
      const nose = landmarks[0]
      const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2
      const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2
      acc.shoulderY += shoulderCenterY
      acc.noseShoulderOffset += nose.x - shoulderCenterX

      if (hasHips(landmarks)) {
        const leftHip = landmarks[23]
        const rightHip = landmarks[24]
        const hipCenterX = (leftHip.x + rightHip.x) / 2
        acc.shoulderHipOffset += shoulderCenterX - hipCenterX
        hipFrameCount += 1
      }
      return acc
    },
    { shoulderY: 0, shoulderHipOffset: 0, noseShoulderOffset: 0 },
  )

  return {
    shoulderY: totals.shoulderY / usable.length,
    noseShoulderOffset: totals.noseShoulderOffset / usable.length,
    shoulderHipOffset: hipFrameCount > 0 ? totals.shoulderHipOffset / hipFrameCount : null,
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
    slouch = Math.abs(shoulderHipOffset - baseline.shoulderHipOffset) > 0.06 ? 1 : 0
  }

  const deviations: PoseDeviationCounts = {
    shoulderShrug: shoulderCenterY < baseline.shoulderY - 0.035 ? 1 : 0,
    slouch,
    forwardHead: Math.abs(noseShoulderOffset - baseline.noseShoulderOffset) > 0.055 ? 1 : 0,
  }

  const active = Object.values(deviations).filter(Boolean).length
  if (!active) return { level: 'good', label: '姿势良好', detail: '肩颈线条稳定，继续保持当前节奏。', deviations }

  const detail = [
    deviations.forwardHead ? '头部前倾，轻轻收下巴' : '',
    deviations.shoulderShrug ? '肩膀上提，试着沉肩' : '',
    deviations.slouch ? '躯干偏移，胸口打开一些' : '',
  ].filter(Boolean).join('；')

  return { level: active >= 2 ? 'bad' : 'warn', label: active >= 2 ? '需要调整' : '略有偏差', detail, deviations }
}
