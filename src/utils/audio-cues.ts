let audioContext: AudioContext | null = null

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }
  return audioContext
}

const playTone = (frequency: number, startOffset: number, duration: number, volume = 0.1) => {
  if (!('AudioContext' in window)) return
  const context = getAudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const start = context.currentTime + startOffset

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

export const playCountdownBeep = (remainingSeconds: number) => {
  const isFinalSecond = remainingSeconds <= 1
  const frequency = isFinalSecond ? 1180 : 620 + (5 - remainingSeconds) * 140
  playTone(frequency, 0, isFinalSecond ? 0.18 : 0.11, isFinalSecond ? 0.15 : 0.1)
}

export const playCompletionChime = () => {
  playTone(659, 0, 0.12, 0.1)
  playTone(784, 0.13, 0.12, 0.1)
  playTone(988, 0.26, 0.18, 0.12)
  playTone(1318, 0.46, 0.28, 0.1)
}
