import type { AppSettings } from '../types'

const swUrl = '/reminder-sw.js'
let reminderTimer: number | undefined

const canNotify = () => 'Notification' in window

export const notificationPermission = () => (canNotify() ? Notification.permission : 'denied')

export const registerReminderWorker = async () => {
  if (!('serviceWorker' in navigator)) return null
  return navigator.serviceWorker.register(swUrl)
}

export const requestNotificationPermission = async () => {
  if (!canNotify()) return 'denied' as NotificationPermission
  if (Notification.permission !== 'default') return Notification.permission
  return Notification.requestPermission()
}

export const cancelReminder = async () => {
  if (reminderTimer) {
    window.clearTimeout(reminderTimer)
    reminderTimer = undefined
  }
  const registration = await navigator.serviceWorker?.getRegistration(swUrl)
  registration?.active?.postMessage({ type: 'CANCEL_REMINDER' })
}

const showLocalNotification = async (settings: AppSettings) => {
  if (!settings.reminderEnabled || notificationPermission() !== 'granted') return

  const registration = await navigator.serviceWorker?.getRegistration(swUrl)
  if (registration) {
    await registration.showNotification('肩颈放松时间到了', {
      body: '站起来做一组 2 分钟微休息，放松肩颈。',
      icon: '/favicon.svg',
      tag: 'shoulder-relax-reminder',
      data: { url: '/' },
    })
    return
  }

  new Notification('肩颈放松时间到了', {
    body: '站起来做一组 2 分钟微休息，放松肩颈。',
    icon: '/favicon.svg',
    tag: 'shoulder-relax-reminder',
  })
}

export const scheduleReminder = async (settings: AppSettings) => {
  await cancelReminder()
  if (!settings.reminderEnabled || notificationPermission() !== 'granted') return

  const intervalMs = settings.reminderIntervalMinutes * 60 * 1000
  reminderTimer = window.setTimeout(() => {
    void showLocalNotification(settings)
    void scheduleReminder(settings)
  }, intervalMs)

  const registration = await registerReminderWorker()
  const worker = registration?.active ?? registration?.waiting ?? registration?.installing
  worker?.postMessage({
    type: 'SCHEDULE_REMINDER',
    intervalMinutes: settings.reminderIntervalMinutes,
  })
}
