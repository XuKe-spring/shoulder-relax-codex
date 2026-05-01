import type { WorkoutRecord } from '../types'

const dayMs = 24 * 60 * 60 * 1000

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
