import { Link } from 'react-router-dom'
import {
  averageScore,
  buildDailyCounts,
  countRecordsSince,
  countRecordsThisMonth,
  courseSummaries,
  deviationTotals,
  dominantDeviation,
  recentScoreTrend,
  streakDays,
  totalMinutes,
} from '../utils/history'
import { readWorkoutRecords } from '../utils/storage'

const formatDate = (date: Date) => date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`

export const History = () => {
  const records = readWorkoutRecords()
  const heatmapDays = buildDailyCounts(records, 28)
  const sevenDays = buildDailyCounts(records, 7)
  const maxDailyCount = Math.max(1, ...sevenDays.map((day) => day.count))
  const trend = recentScoreTrend(records)
  const totals = deviationTotals(records)
  const totalDeviationCount = Math.max(1, totals.forwardHead + totals.shoulderShrug + totals.slouch)
  const topDeviation = dominantDeviation(records)
  const summaries = courseSummaries(records)

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
        <div className="stat-panel"><span>平均评分</span><strong>{records.length ? `${averageScore(records)} 分` : '--'}</strong></div>
        <div className="stat-panel"><span>主要偏差</span><strong>{topDeviation.count ? topDeviation.label : '--'}</strong></div>
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

      <section className="insight-grid" aria-label="训练质量分析">
        <div className="analytics-panel">
          <div className="section-heading">
            <h2>近 {trend.length || 7} 次评分趋势</h2>
          </div>
          {trend.length ? (
            <div className="score-trend">
              {trend.map((item) => (
                <div className="score-point" key={item.key}>
                  <span style={{ height: `${Math.max(8, item.score)}%` }} title={`${item.courseName} ${item.score} 分`} />
                  <strong>{item.score}</strong>
                  <em>{formatDate(item.date)}</em>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-history">完成训练后会显示最近评分趋势。</div>
          )}
        </div>

        <div className="analytics-panel">
          <div className="section-heading">
            <h2>姿态偏差汇总</h2>
          </div>
          <div className="deviation-breakdown">
            <div>
              <span>头前倾</span>
              <strong>{totals.forwardHead} 次</strong>
              <i style={{ width: `${(totals.forwardHead / totalDeviationCount) * 100}%` }} />
            </div>
            <div>
              <span>耸肩</span>
              <strong>{totals.shoulderShrug} 次</strong>
              <i style={{ width: `${(totals.shoulderShrug / totalDeviationCount) * 100}%` }} />
            </div>
            <div>
              <span>躯干偏移</span>
              <strong>{totals.slouch} 次</strong>
              <i style={{ width: `${(totals.slouch / totalDeviationCount) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="history-section" aria-label="按课程统计">
        <div className="section-heading">
          <h2>按课程统计</h2>
        </div>
        {summaries.length ? (
          <div className="course-summary-grid">
            {summaries.map((summary) => (
              <article className="course-summary-card" key={summary.courseId}>
                <div>
                  <strong>{summary.courseName}</strong>
                  <span>最近 {formatDate(summary.lastDate)}</span>
                </div>
                <div className="summary-metrics">
                  <span>{summary.count} 次</span>
                  <span>{summary.minutes} 分钟</span>
                  <span>{summary.averageScore} 分</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-history">完成训练后会自动生成课程维度统计。</div>
        )}
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
                  <span>头前倾 {record.deviations.forwardHead} · 耸肩 {record.deviations.shoulderShrug} · 躯干偏移 {record.deviations.slouch}</span>
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
