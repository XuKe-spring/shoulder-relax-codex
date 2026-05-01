import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { PoseOverlay } from '../components/PoseOverlay'
import { ExerciseAnimation } from '../components/svg-animations/ExerciseAnimation'
import { TimerBar } from '../components/TimerBar'
import { getCourseById } from '../data/courses'
import { useTimer } from '../hooks/useTimer'
import type { PoseDeviationCounts, PoseFeedback, WorkoutRecord } from '../types'
import { readSettings, saveWorkoutRecord } from '../utils/storage'
import { speak, stopSpeaking } from '../utils/tts'

const emptyDeviations = (): PoseDeviationCounts => ({ shoulderShrug: 0, slouch: 0, forwardHead: 0 })
const addDeviations = (left: PoseDeviationCounts, right: PoseDeviationCounts): PoseDeviationCounts => ({
  shoulderShrug: left.shoulderShrug + right.shoulderShrug,
  slouch: left.slouch + right.slouch,
  forwardHead: left.forwardHead + right.forwardHead,
})
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
const scoreFor = (deviations: PoseDeviationCounts) => Math.max(0, 100 - (deviations.forwardHead + deviations.shoulderShrug + deviations.slouch) * 2)

export const Train = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const course = getCourseById(id)
  const [stepIndex, setStepIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [calibrationSeconds, setCalibrationSeconds] = useState(3)
  const [baselineReady, setBaselineReady] = useState(false)
  const [feedback, setFeedback] = useState<PoseFeedback>({
    level: 'idle',
    label: '准备校准',
    detail: '请站直并让上半身进入画面。',
    deviations: emptyDeviations(),
  })
  const [totalDeviations, setTotalDeviations] = useState<PoseDeviationCounts>(emptyDeviations)
  const [stepSummary, setStepSummary] = useState({ stepIndex: 0, text: '完成当前动作后会显示姿态总结。' })
  const [voiceEnabled] = useState(() => readSettings().voiceEnabled)
  const [startedAt] = useState(() => Date.now())
  const lastAccumulatedAtRef = useRef(0)
  const currentStep = course?.steps[stepIndex]
  const isTraining = calibrationSeconds === 0

  const finishTraining = useCallback((completedSteps: number) => {
    if (!course) return
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000))
    const record: WorkoutRecord = {
      date: new Date().toISOString(),
      courseId: course.id,
      courseName: course.name,
      completedSteps,
      totalSteps: course.steps.length,
      durationSeconds,
      poseScore: scoreFor(totalDeviations),
      deviations: totalDeviations,
    }
    saveWorkoutRecord(record)
    stopSpeaking()
    navigate('/complete', { state: { record } })
  }, [course, navigate, startedAt, totalDeviations])

  const goNext = useCallback(() => {
    if (!course) return
    setStepSummary({ stepIndex, text: feedback.detail || '当前动作姿态稳定。' })
    if (stepIndex >= course.steps.length - 1) {
      finishTraining(course.steps.length)
      return
    }
    setStepIndex((index) => index + 1)
  }, [course, feedback.detail, finishTraining, stepIndex])

  const { remainingSeconds, progress } = useTimer({
    durationSeconds: currentStep?.durationSeconds ?? 0,
    isRunning: Boolean(currentStep && isTraining && !paused),
    onComplete: goNext,
    resetKey: `${course?.id ?? 'course'}-${stepIndex}`,
  })

  useEffect(() => {
    if (calibrationSeconds <= 0 || paused) return undefined
    const interval = window.setInterval(() => {
      setCalibrationSeconds((seconds) => Math.max(0, seconds - 1))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [calibrationSeconds, paused])

  useEffect(() => {
    if (currentStep && isTraining && voiceEnabled) speak(currentStep.ttsText)
  }, [currentStep, isTraining, voiceEnabled])
  useEffect(() => () => stopSpeaking(), [])

  const handleFeedback = useCallback((nextFeedback: PoseFeedback) => {
    setFeedback(nextFeedback)
    const now = Date.now()
    if (now - lastAccumulatedAtRef.current > 1900) {
      lastAccumulatedAtRef.current = now
      setTotalDeviations((current) => addDeviations(current, nextFeedback.deviations))
    }
  }, [])

  const headerText = useMemo(() => {
    if (!course || !currentStep) return ''
    return `${course.name} · 动作 ${stepIndex + 1}/${course.steps.length} · ${currentStep.name}`
  }, [course, currentStep, stepIndex])

  if (!course || !currentStep) return <Navigate to="/" replace />

  return (
    <main className="train-shell">
      <header className="train-topbar">
        <Link to="/" className="ghost-link">返回首页</Link>
        <div><strong>{headerText}</strong><span>总时长 {formatTime(course.totalSeconds)}</span></div>
        <div className="top-timer">{isTraining ? formatTime(remainingSeconds) : `校准 ${calibrationSeconds}s`}</div>
      </header>
      <section className="train-grid">
        <ExerciseAnimation type={currentStep.svgAnimation} title={currentStep.name} />
        <div className="camera-column">
          <PoseOverlay paused={paused} calibrationActive={!isTraining} onBaselineReady={() => setBaselineReady(true)} onFeedback={handleFeedback} />
          <div className={`feedback-card ${feedback.level}`}>
            <div><span>姿势状态</span><strong>{!isTraining ? '站直校准中' : feedback.label}</strong></div>
            <p>{!isTraining ? (baselineReady ? '基准已采集，倒计时结束后开始训练。' : '保持自然站直 3 秒；如果只看到脸部，请后退让双肩进入画面。') : feedback.detail}</p>
          </div>
        </div>
      </section>
      <section className="training-console">
        <TimerBar progress={isTraining ? progress : (3 - calibrationSeconds) / 3} remainingSeconds={isTraining ? remainingSeconds : calibrationSeconds} />
        <div className="step-summary"><span>动作总结</span><p>{stepSummary.stepIndex === stepIndex ? stepSummary.text : '完成当前动作后会显示姿态总结。'}</p></div>
        <div className="control-row">
          <button type="button" onClick={() => setStepIndex((index) => Math.max(0, index - 1))} disabled={stepIndex === 0}>上一个</button>
          <button type="button" className="primary-button" onClick={() => setPaused((value) => !value)}>{paused ? '继续' : '暂停'}</button>
          <button type="button" onClick={goNext}>下一个</button>
          <button type="button" className="danger-button" onClick={() => finishTraining(stepIndex)}>退出</button>
        </div>
      </section>
    </main>
  )
}

