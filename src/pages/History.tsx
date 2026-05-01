import { Link } from 'react-router-dom'
import { buildDailyCounts, countRecordsSince, countRecordsThisMonth, streakDays, totalMinutes } from '../utils/history'
import { readWorkoutRecords } from '../utils/storage'

const formatDate = (date: Date) => date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`

export const History = () => {
  const records = readWorkoutRecords()
  const heatmapDays = buildDailyCounts(records, 28)
  const sevenDays = buildDailyCounts(records, 7)
  const maxDailyCount = Math.max(1, ...sevenDays.map((day) => day.count))

  return (
    <main className="home-shell">
      <section className="subpage-header">
        <div>
          <p className="eyebrow">训练历史</p>
          <h1>记录每一次肩颈恢复。</h1>
        </div>
        <div className="header-actions">
          <Link className="secondary-link" to="/">首页</Link>
          <Link className="primary-link" to="/train/micro">开始训练</Link>
        </div>
      </section>

      <section className="dashboard-band" aria-label="历史统计">
        <div className="stat-panel"><span>本周次数</span><strong>{countRecordsSince(records, 7)} 次</strong></div>
        <div className="stat-panel"><span>本月次数</span><strong>{countRecordsThisMonth(records)} 次</strong></div>
        <div className="stat-panel"><span>累计分钟</span><strong>{totalMinutes(records)} 分</strong></div>
        <div className="stat-panel"><span>连续打卡</span><strong>{streakDays(records)} 天</strong></div>
      </section>

      <section className="analytics-grid">
        <div className="analytics-panel">
          <div className="section-heading">
            <h2>近 4 周打卡</h2>
          </div>
          <div className="heatmap-grid" aria-label="近 4 周打卡热力图">
            {heatmapDays.map((day) => (
              <span
                className={`heatmap-cell level-${Math.min(day.count, 3)}`}
                key={day.key}
                title={`${formatDate(day.date)} ${day.count} 次`}
              />
            ))}
          </div>
        </div>

        <div className="analytics-panel">
          <div className="section-heading">
            <h2>近 7 天训练</h2>
          </div>
          <div className="bar-chart" aria-label="近 7 天柱状图">
            {sevenDays.map((day) => (
              <div className="bar-item" key={day.key}>
                <div className="bar-track"><span style={{ height: `${(day.count / maxDailyCount) * 100}%` }} /></div>
                <strong>{day.count}</strong>
                <span>{day.date.getDate()}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="history-section" aria-label="训练记录列表">
        <div className="section-heading">
          <h2>全部记录</h2>
        </div>
        {records.length ? (
          <div className="history-list">
            {records.map((record) => (
              <article className="history-row" key={`${record.date}-${record.courseId}`}>
                <div>
                  <strong>{record.courseName}</strong>
                  <span>{new Date(record.date).toLocaleString('zh-CN')} · {record.completedSteps}/{record.totalSteps} 个动作</span>
                </div>
                <div>
                  <strong>{record.poseScore} 分</strong>
                  <span>{formatTime(record.durationSeconds)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-history">还没有训练记录。完成一次训练后会自动保存到这里。</div>
        )}
      </section>
    </main>
  )
}
