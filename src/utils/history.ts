import type { WorkoutRecord } from '../types'

const dayMs = 24 * 60 * 60 * 1000
const deviationLabels = {
  forwardHead: '头前倾',
  shoulderShrug: '耸肩',
  slouch: '躯干偏移',
} as const

export const dateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const startOfLocalDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const countRecordsSince = (records: WorkoutRecord[], days: number) => {
  const start = startOfLocalDay(new Date(Date.now() - (days - 1) * dayMs))
  return records.filter((record) => new Date(record.date) >= start).length
}

export const countRecordsThisMonth = (records: WorkoutRecord[]) => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  return records.filter((record) => new Date(record.date) >= start).length
}

export const totalMinutes = (records: WorkoutRecord[]) =>
  Math.round(records.reduce((sum, record) => sum + record.durationSeconds, 0) / 60)

export const averageScore = (records: WorkoutRecord[]) => {
  if (!records.length) return 0
  return Math.round(records.reduce((sum, record) => sum + record.poseScore, 0) / records.length)
}

export const deviationTotals = (records: WorkoutRecord[]) =>
  records.reduce(
    (totals, record) => ({
      forwardHead: totals.forwardHead + record.deviations.forwardHead,
      shoulderShrug: totals.shoulderShrug + record.deviations.shoulderShrug,
      slouch: totals.slouch + record.deviations.slouch,
    }),
    { forwardHead: 0, shoulderShrug: 0, slouch: 0 },
  )

export const dominantDeviation = (records: WorkoutRecord[]) => {
  const totals = deviationTotals(records)
  const [top] = Object.entries(totals).sort((left, right) => right[1] - left[1])
  if (!top || top[1] === 0) return { label: '暂无偏差', count: 0 }
  return { label: deviationLabels[top[0] as keyof typeof deviationLabels], count: top[1] }
}

export const recentScoreTrend = (records: WorkoutRecord[], limit = 7) =>
  [...records]
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
    .slice(-limit)
    .map((record) => ({
      key: `${record.date}-${record.courseId}`,
      date: new Date(record.date),
      score: record.poseScore,
      courseName: record.courseName,
    }))

export const courseSummaries = (records: WorkoutRecord[]) => {
  const summaries = new Map<string, {
    courseId: string
    courseName: string
    count: number
    totalSeconds: number
    totalScore: number
    lastDate: Date
  }>()

  records.forEach((record) => {
    const current = summaries.get(record.courseId)
    const recordDate = new Date(record.date)
    if (!current) {
      summaries.set(record.courseId, {
        courseId: record.courseId,
        courseName: record.courseName,
        count: 1,
        totalSeconds: record.durationSeconds,
        totalScore: record.poseScore,
        lastDate: recordDate,
      })
      return
    }

    current.count += 1
    current.totalSeconds += record.durationSeconds
    current.totalScore += record.poseScore
    if (recordDate > current.lastDate) current.lastDate = recordDate
  })

  return [...summaries.values()]
    .map((summary) => ({
      courseId: summary.courseId,
      courseName: summary.courseName,
      count: summary.count,
      minutes: Math.round(summary.totalSeconds / 60),
      averageScore: Math.round(summary.totalScore / summary.count),
      lastDate: summary.lastDate,
    }))
    .sort((left, right) => right.count - left.count || right.lastDate.getTime() - left.lastDate.getTime())
}

export const streakDays = (records: WorkoutRecord[]) => {
  const activeDays = new Set(records.map((record) => dateKey(new Date(record.date))))
  let streak = 0
  let cursor = startOfLocalDay(new Date())

  while (activeDays.has(dateKey(cursor))) {
    streak += 1
    cursor = new Date(cursor.getTime() - dayMs)
  }

  return streak
}

export const buildDailyCounts = (records: WorkoutRecord[], days: number) => {
  const counts = new Map<string, number>()
  records.forEach((record) => {
    const key = dateKey(new Date(record.date))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })

  const today = startOfLocalDay(new Date())
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getTime() - (days - 1 - index) * dayMs)
    const key = dateKey(date)
    return { key, date, count: counts.get(key) ?? 0 }
  })
}
