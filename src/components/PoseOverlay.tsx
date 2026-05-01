import type { NormalizedLandmarkList, Results } from '@mediapipe/pose'
import { useEffect, useRef, useState } from 'react'
import type { PoseFeedback } from '../types'
import { analyzePose, createBaseline, type PoseBaseline } from '../utils/pose-analysis'

declare global {
  interface Window {
    Pose?: new (config?: { locateFile?: (file: string) => string }) => PoseRuntime
  }
}

interface PoseRuntime {
  close: () => Promise<void>
  onResults: (listener: (results: Results) => void) => void
  send: (inputs: { image: HTMLVideoElement }) => Promise<void>
  setOptions: (options: Record<string, unknown>) => void
}

interface PoseOverlayProps {
  paused: boolean
  calibrationActive: boolean
  onFeedback: (feedback: PoseFeedback) => void
  onBaselineReady: () => void
}

const POSE_CONNECTIONS: Array<[number, number]> = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 24], [0, 11], [0, 12],
]

const POSE_INTERVAL_MS = 125

const sumDeviations = (feedback: PoseFeedback) =>
  feedback.deviations.forwardHead + feedback.deviations.shoulderShrug + feedback.deviations.slouch

const loadPoseScript = () =>
  new Promise<void>((resolve, reject) => {
    if (window.Pose) {
      resolve()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-mediapipe-pose]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('MediaPipe Pose 加载失败')), { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js'
    script.async = true
    script.dataset.mediapipePose = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('MediaPipe Pose 加载失败'))
    document.head.appendChild(script)
  })

export const PoseOverlay = ({ paused, calibrationActive, onFeedback, onBaselineReady }: PoseOverlayProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const poseRef = useRef<PoseRuntime | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const requestRef = useRef<number | null>(null)
  const baselineRef = useRef<PoseBaseline | null>(null)
  const calibrationFramesRef = useRef<NormalizedLandmarkList[]>([])
  const latestLandmarksRef = useRef<NormalizedLandmarkList | null>(null)
  const latestFeedbackRef = useRef<PoseFeedback | null>(null)
  const lastFeedbackAtRef = useRef(0)
  const lastPoseAtRef = useRef(0)
  const poseBusyRef = useRef(false)
  const pausedRef = useRef(paused)
  const calibrationActiveRef = useRef(calibrationActive)
  const onFeedbackRef = useRef(onFeedback)
  const onBaselineReadyRef = useRef(onBaselineReady)
  const [cameraState, setCameraState] = useState<'loading' | 'ready' | 'denied' | 'error'>('loading')

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    calibrationActiveRef.current = calibrationActive
  }, [calibrationActive])

  useEffect(() => {
    onFeedbackRef.current = onFeedback
    onBaselineReadyRef.current = onBaselineReady
  }, [onBaselineReady, onFeedback])

  useEffect(() => {
    let mounted = true

    const handlePoseResults = (results: Results) => {
      const landmarks = results.poseLandmarks
      if (!landmarks?.length) return
      latestLandmarksRef.current = landmarks

      if (calibrationActiveRef.current && !baselineRef.current) {
        calibrationFramesRef.current.push(landmarks)
        const baseline = createBaseline(calibrationFramesRef.current)
        if (baseline && calibrationFramesRef.current.length >= 12) {
          baselineRef.current = baseline
          onBaselineReadyRef.current()
        }
      }

      const now = Date.now()
      if (now - lastFeedbackAtRef.current > 1800) {
        const feedback = analyzePose(landmarks, baselineRef.current)
        lastFeedbackAtRef.current = now
        latestFeedbackRef.current = feedback
        onFeedbackRef.current(feedback)
      }
    }

    const drawFrame = () => {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas?.getContext('2d')
      if (canvas && video && context && video.readyState >= 2) {
        const width = video.videoWidth || 640
        const height = video.videoHeight || 360
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }

        context.save()
        context.clearRect(0, 0, width, height)
        context.translate(width, 0)
        context.scale(-1, 1)
        context.drawImage(video, 0, 0, width, height)
        context.restore()

        if (latestLandmarksRef.current) {
          drawSkeleton(context, latestLandmarksRef.current, width, height)
        }

        const feedback = latestFeedbackRef.current
        if (feedback && !calibrationActiveRef.current && sumDeviations(feedback) > 0) {
          context.fillStyle = 'rgba(12, 19, 32, 0.72)'
          context.fillRect(24, height - 72, Math.min(width - 48, 520), 48)
          context.fillStyle = '#f8fafc'
          context.font = '20px system-ui, sans-serif'
          context.fillText(feedback.detail, 42, height - 42)
        }

        const now = performance.now()
        if (!pausedRef.current && poseRef.current && now - lastPoseAtRef.current >= POSE_INTERVAL_MS && !poseBusyRef.current) {
          lastPoseAtRef.current = now
          poseBusyRef.current = true
          void poseRef.current
            .send({ image: video })
            .catch((error) => console.error(error))
            .finally(() => {
              poseBusyRef.current = false
            })
        }
      }

      requestRef.current = window.requestAnimationFrame(drawFrame)
    }

    const setup = async () => {
      try {
        await loadPoseScript()
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 30, max: 30 }, facingMode: 'user' },
          audio: false,
        })
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        const video = videoRef.current
        if (!video || !window.Pose) return
        video.srcObject = stream
        await video.play()

        const pose = new window.Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}` })
        pose.setOptions({
          modelComplexity: 0,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })
        pose.onResults(handlePoseResults)
        poseRef.current = pose
        setCameraState('ready')
        requestRef.current = window.requestAnimationFrame(drawFrame)
      } catch (error) {
        console.error(error)
        setCameraState(error instanceof DOMException && error.name === 'NotAllowedError' ? 'denied' : 'error')
      }
    }

    setup()
    return () => {
      mounted = false
      if (requestRef.current) window.cancelAnimationFrame(requestRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
      void poseRef.current?.close()
    }
  }, [])

  return (
    <div className="pose-panel">
      <div className="panel-label">摄像头骨骼叠加</div>
      <video ref={videoRef} className="pose-video" playsInline muted />
      <canvas ref={canvasRef} className="pose-canvas" />
      {cameraState !== 'ready' && (
        <div className="camera-state">
          {cameraState === 'loading' && '正在打开摄像头...'}
          {cameraState === 'denied' && '摄像头权限被拒绝，请在浏览器设置中允许访问。'}
          {cameraState === 'error' && '无法打开摄像头，可继续使用动作演示训练。'}
        </div>
      )}
    </div>
  )
}

const drawSkeleton = (context: CanvasRenderingContext2D, landmarks: NormalizedLandmarkList, width: number, height: number) => {
  context.save()
  context.translate(width, 0)
  context.scale(-1, 1)
  context.lineWidth = 5
  context.strokeStyle = 'rgba(77, 212, 172, 0.94)'
  POSE_CONNECTIONS.forEach(([start, end]) => {
    const from = landmarks[start]
    const to = landmarks[end]
    if (!from || !to || (from.visibility ?? 1) < 0.35 || (to.visibility ?? 1) < 0.35) return
    context.beginPath()
    context.moveTo(from.x * width, from.y * height)
    context.lineTo(to.x * width, to.y * height)
    context.stroke()
  })
  landmarks.forEach((landmark, index) => {
    if ((landmark.visibility ?? 1) < 0.35) return
    const important = [0, 11, 12, 13, 14, 23, 24].includes(index)
    context.beginPath()
    context.arc(landmark.x * width, landmark.y * height, important ? 7 : 4, 0, Math.PI * 2)
    context.fillStyle = important ? '#6aa7ff' : '#f8fafc'
    context.fill()
  })
  context.restore()
}
