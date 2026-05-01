export type AnimationKey =
  | 'neckSideStretch'
  | 'neckTurn'
  | 'shoulderShrug'
  | 'shoulderRoll'
  | 'chestOpen'
  | 'chinTuck'
  | 'armRaise'
  | 'sideStretch'
  | 'neckCircle'
  | 'scapulaSqueeze'
  | 'thoracicRotate'
  | 'fullBodyReach'

export interface CourseStep {
  name: string
  durationSeconds: number
  ttsText: string
  svgAnimation: AnimationKey
}

export interface Course {
  id: string
  name: string
  description: string
  totalSeconds: number
  steps: CourseStep[]
}

export interface PoseDeviationCounts {
  shoulderShrug: number
  slouch: number
  forwardHead: number
}

export interface WorkoutRecord {
  date: string
  courseId: string
  courseName: string
  completedSteps: number
  totalSteps: number
  durationSeconds: number
  poseScore: number
  deviations: PoseDeviationCounts
}

export type ReminderIntervalMinutes = 30 | 45 | 60 | 90 | 120

export interface AppSettings {
  reminderEnabled: boolean
  reminderIntervalMinutes: ReminderIntervalMinutes
  voiceEnabled: boolean
  onboardingCompleted: boolean
}

export interface PoseFeedback {
  level: 'good' | 'warn' | 'bad' | 'idle'
  label: string
  detail: string
  deviations: PoseDeviationCounts
}
