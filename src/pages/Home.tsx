import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { courses } from '../data/courses'
import type { WorkoutRecord } from '../types'
import { readWorkoutRecords } from '../utils/storage'

const formatMinutes = (seconds: number) => `${Math.round(seconds / 60)} 分钟`
const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`
const formatDate = (date: string) => new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })

export const Home = () => {
  const [records] = useState<WorkoutRecord[]>(() => readWorkoutRecords())

  const stats = useMemo(() => {
    const totalSeconds = records.reduce((sum, record) => sum + record.durationSeconds, 0)
    const averageScore = records.length
      ? Math.round(records.reduce((sum, record) => sum + record.poseScore, 0) / records.length)
      : 0
    const today = new Date().toDateString()
    const todayCount = records.filter((record) => new Date(record.date).toDateString() === today).length
    return { totalSeconds, averageScore, todayCount }
  }, [records])

  const lastCourseId = records[0]?.courseId ?? 'micro'

  return (
    <main className="home-shell">
      <section className="home-hero">
        <div>
          <p className="eyebrow">肩颈放松训练</p>
          <h1>站起来，用摄像头跟着动画做一组肩颈恢复。</h1>
          <p className="hero-copy">
            左侧标准动作演示，右侧实时骨骼叠加。训练页已包含校准、姿态检测、倒计时和语音引导。
          </p>
        </div>
        <div className="hero-actions">
          <Link className="primary-link" to={`/train/${lastCourseId}`}>{records.length ? '继续常用训练' : '开始微休息'}</Link>
          <Link className="secondary-link" to="/train/standard">标准课程</Link>
          <Link className="secondary-link" to="/history">查看历史</Link>
          <Link className="secondary-link" to="/settings">设置提醒</Link>
        </div>
      </section>

      <section className="dashboard-band" aria-label="训练概览">
        <div className="stat-panel">
          <span>今日训练</span>
          <strong>{stats.todayCount} 次</strong>
        </div>
        <div className="stat-panel">
          <span>累计时长</span>
          <strong>{formatDuration(stats.totalSeconds)}</strong>
        </div>
        <div className="stat-panel">
          <span>平均评分</span>
          <strong>{records.length ? `${stats.averageScore} 分` : '--'}</strong>
        </div>
      </section>

      <section className="course-grid" aria-label="训练课程">
        {courses.map((course) => (
          <article className="course-card" key={course.id}>
            <div>
              <h2>{course.name}</h2>
              <p>{course.description}</p>
            </div>
            <div className="course-meta">
              <span>{course.steps.length} 个动作</span>
              <span>{formatMinutes(course.totalSeconds)}</span>
            </div>
            <Link to={`/train/${course.id}`}>进入训练</Link>
          </article>
        ))}
      </section>

      <section className="history-section" aria-label="最近训练">
        <div className="section-heading">
          <div>
            <p className="eyebrow">训练记录</p>
            <h2>最近完成</h2>
          </div>
          <Link className="text-link" to="/history">全部记录</Link>
        </div>
        {records.length ? (
          <div className="history-list">
            {records.slice(0, 5).map((record) => (
              <article className="history-row" key={`${record.date}-${record.courseId}`}>
                <div>
                  <strong>{record.courseName}</strong>
                  <span>{formatDate(record.date)} · {record.completedSteps}/{record.totalSteps} 个动作</span>
                </div>
                <div>
                  <strong>{record.poseScore}</strong>
                  <span>{formatDuration(record.durationSeconds)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-history">完成一次训练后，这里会显示最近记录和姿态评分。</div>
        )}
      </section>
    </main>
  )
}
