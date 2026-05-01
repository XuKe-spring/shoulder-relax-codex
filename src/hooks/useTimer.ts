import { useEffect, useRef, useState } from 'react'

interface UseTimerOptions {
  durationSeconds: number
  isRunning: boolean
  onComplete: () => void
  resetKey?: string | number
}

export const useTimer = ({ durationSeconds, isRunning, onComplete, resetKey }: UseTimerOptions) => {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds)
  const completedRef = useRef(false)

  useEffect(() => {
    completedRef.current = false
    const resetTimer = window.setTimeout(() => {
      setRemainingSeconds(durationSeconds)
    }, 0)
    return () => window.clearTimeout(resetTimer)
  }, [durationSeconds, resetKey])

  useEffect(() => {
    if (!isRunning) return undefined
    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          if (!completedRef.current) {
            completedRef.current = true
            window.setTimeout(onComplete, 0)
          }
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [isRunning, onComplete])

  return {
    remainingSeconds,
    progress: durationSeconds > 0 ? (durationSeconds - remainingSeconds) / durationSeconds : 0,
  }
}
