let reminderTimer = null

const clearReminder = () => {
  if (reminderTimer) {
    clearTimeout(reminderTimer)
    reminderTimer = null
  }
}

const scheduleReminder = (intervalMinutes) => {
  clearReminder()
  reminderTimer = setTimeout(() => {
    self.registration.showNotification('肩颈放松时间到了', {
      body: '站起来做一组 2 分钟微休息，放松肩颈。',
      icon: '/favicon.svg',
      tag: 'shoulder-relax-reminder',
      data: { url: '/' },
    })
    scheduleReminder(intervalMinutes)
  }, intervalMinutes * 60 * 1000)
}

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_REMINDER') scheduleReminder(event.data.intervalMinutes)
  if (event.data?.type === 'CANCEL_REMINDER') clearReminder()
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url ?? '/'

  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const existing = clients.find((client) => new URL(client.url).origin === self.location.origin)
    if (existing) {
      await existing.focus()
      return
    }
    await self.clients.openWindow(targetUrl)
  })())
})
