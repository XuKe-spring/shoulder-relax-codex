import type { AppSettings, WorkoutRecord } from '../types'

const HISTORY_KEY = 'workout_history'
const SETTINGS_KEY = 'app_settings'

export const defaultSettings: AppSettings = {
  reminderEnabled: false,
  reminderIntervalMinutes: 60,
  voiceEnabled: true,
  onboardingCompleted: false,
}

export const saveWorkoutRecord = (record: WorkoutRecord) => {
  const records = readWorkoutRecords()
  localStorage.setItem(HISTORY_KEY, JSON.stringify([record, ...records]))
}

export const readWorkoutRecords = (): WorkoutRecord[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as WorkoutRecord[]) : []
  } catch {
    return []
  }
}

export const readSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export const updateSettings = (updates: Partial<AppSettings>) => {
  const next = { ...readSettings(), ...updates }
  saveSettings(next)
  return next
}
