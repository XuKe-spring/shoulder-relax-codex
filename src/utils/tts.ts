export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  const voices = window.speechSynthesis.getVoices()
  const preferredVoice = voices.find((voice) => voice.lang === 'zh-CN' && /xiaoxiao|xiaoyi|huihui|tingting|yaoyao|hanhan/i.test(voice.name))
    ?? voices.find((voice) => voice.lang === 'zh-CN')
    ?? voices.find((voice) => voice.lang.startsWith('zh'))

  if (preferredVoice) utterance.voice = preferredVoice
  utterance.rate = 0.86
  utterance.pitch = 1.04
  utterance.volume = 0.95
  window.speechSynthesis.speak(utterance)
}

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
