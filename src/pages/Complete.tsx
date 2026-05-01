import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { PoseDeviationCounts, WorkoutRecord } from '../types'
import { playCompletionChime } from '../utils/audio-cues'
import { streakDays } from '../utils/history'
import { readSettings, readWorkoutRecords } from '../utils/storage'
import { speak } from '../utils/tts'

const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`

const recoveryAdvice = (deviations: PoseDeviationCounts) => {
  const entries = [
    { value: deviations.forwardHead, text: '下次优先做收下巴动作，保持耳朵靠近肩线。' },
    { value: deviations.shoulderShrug, text: '下次把注意力放在呼气沉肩，减少肩膀上提。' },
    { value: deviations.slouch, text: '下次打开胸口并稳定骨盆，避免身体左右偏移。' },
  ].sort((left, right) => right.value - left.value)

  if (entries[0].value === 0) return '本次姿态很稳定，可以保持当前节奏，明天继续做一组微休息。'
  return entries[0].text
}

export const Complete = () => {
  const location = useLocation()
  const record = (location.state as { record?: WorkoutRecord } | null)?.record
  const streak = streakDays(readWorkoutRecords())

  useEffect(() => {
    if (!record) return
    playCompletionChime()
    if (readSettings().voiceEnabled) {
      speak(`训练完成，做得不错。本次姿态评分 ${record.poseScore} 分。`)
    }
  }, [record])

  if (!record) {
    return (
      <main className="complete-shell">
        <h1>暂无训练结果</h1>
        <Link className="primary-link" to="/">回到首页</Link>
      </main>
    )
  }
  return (
    <main className="complete-shell">
      <section className="complete-card">
        <p className="eyebrow">训练完成</p>
        <h1>{record.courseName}</h1>
        <p>{new Date(record.date).toLocaleString('zh-CN')}</p>
        <div className="result-grid">
          <div><span>实际时长</span><strong>{formatDuration(record.durationSeconds)}</strong></div>
          <div><span>姿态评分</span><strong>{record.poseScore} / 100</strong></div>
          <div><span>完成动作</span><strong>{record.completedSteps} / {record.totalSteps}</strong></div>
          <div><span>连续打卡</span><strong>{streak} 天</strong></div>
        </div>
        <div className="deviation-list">
          <strong>姿态提醒</strong>
          <p>头前倾 {record.deviations.forwardHead} 次 · 耸肩 {record.deviations.shoulderShrug} 次 · 躯干偏移 {record.deviations.slouch} 次</p>
        </div>
        <div className="advice-box">
          <strong>下次建议</strong>
          <p>{recoveryAdvice(record.deviations)}</p>
        </div>
        <div className="complete-actions">
          <Link to={`/train/${record.courseId}`}>再来一次</Link>
          <Link to="/history">查看历史</Link>
        </div>
      </section>
    </main>
  )
}
