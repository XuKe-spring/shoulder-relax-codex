export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.92
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
