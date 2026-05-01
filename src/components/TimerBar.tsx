interface TimerBarProps {
  progress: number
  remainingSeconds: number
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

export const TimerBar = ({ progress, remainingSeconds }: TimerBarProps) => (
  <div className="timer-wrap" aria-label="动作倒计时">
    <div className="timer-meta">
      <span>倒计时</span>
      <strong>{formatTime(remainingSeconds)}</strong>
    </div>
    <div className="timer-track">
      <div className="timer-fill" style={{ width: `${Math.min(progress * 100, 100)}%` }} />
    </div>
  </div>
)
