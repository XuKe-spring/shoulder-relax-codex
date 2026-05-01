import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AppSettings, ReminderIntervalMinutes } from '../types'
import { cancelReminder, notificationPermission, requestNotificationPermission, scheduleReminder } from '../utils/reminders'
import { readSettings, saveSettings } from '../utils/storage'

const intervals: ReminderIntervalMinutes[] = [30, 45, 60, 90, 120]

export const Settings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => readSettings())
  const [permission, setPermission] = useState<NotificationPermission>(() => notificationPermission())

  useEffect(() => {
    if (settings.reminderEnabled && permission === 'granted') {
      void scheduleReminder(settings)
      return
    }
    void cancelReminder()
  }, [permission, settings])

  const commit = (next: AppSettings) => {
    setSettings(next)
    saveSettings(next)
  }

  const toggleReminder = async () => {
    if (!settings.reminderEnabled) {
      const nextPermission = await requestNotificationPermission()
      setPermission(nextPermission)
      commit({ ...settings, reminderEnabled: nextPermission === 'granted' })
      return
    }
    commit({ ...settings, reminderEnabled: false })
  }

  return (
    <main className="home-shell">
      <section className="subpage-header">
        <div>
          <p className="eyebrow">设置</p>
          <h1>提醒、语音和训练偏好。</h1>
        </div>
        <div className="header-actions">
          <Link className="secondary-link" to="/">首页</Link>
          <Link className="primary-link" to="/train/micro">快速训练</Link>
        </div>
      </section>

      <section className="settings-panel">
        <div className="setting-row">
          <div>
            <strong>定时提醒</strong>
            <p>到点后浏览器通知你回到肩颈训练。</p>
          </div>
          <button type="button" className={settings.reminderEnabled ? 'toggle-button active' : 'toggle-button'} onClick={toggleReminder}>
            {settings.reminderEnabled ? '已开启' : '已关闭'}
          </button>
        </div>

        <div className="setting-row">
          <div>
            <strong>提醒间隔</strong>
            <p>选择适合办公节奏的休息频率。</p>
          </div>
          <div className="segmented-control">
            {intervals.map((interval) => (
              <button
                type="button"
                className={settings.reminderIntervalMinutes === interval ? 'selected' : ''}
                key={interval}
                onClick={() => commit({ ...settings, reminderIntervalMinutes: interval })}
              >
                {interval}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>语音播报</strong>
            <p>训练切换动作时朗读动作指令。</p>
          </div>
          <button
            type="button"
            className={settings.voiceEnabled ? 'toggle-button active' : 'toggle-button'}
            onClick={() => commit({ ...settings, voiceEnabled: !settings.voiceEnabled })}
          >
            {settings.voiceEnabled ? '已开启' : '已关闭'}
          </button>
        </div>

        <div className="permission-note">
          当前通知权限：{permission === 'granted' ? '已允许' : permission === 'denied' ? '已拒绝' : '未设置'}
        </div>
      </section>
    </main>
  )
}
