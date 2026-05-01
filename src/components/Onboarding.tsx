import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AppSettings, ReminderIntervalMinutes } from '../types'
import { requestNotificationPermission, scheduleReminder } from '../utils/reminders'
import { readSettings, saveSettings } from '../utils/storage'

const intervals: ReminderIntervalMinutes[] = [30, 45, 60, 90, 120]

const steps = [
  { title: '欢迎使用 shoulder-relax', body: '先设置提醒，再跟着动作演示完成一组肩颈放松。所有姿态计算都在本地完成。' },
  { title: '准备摄像头权限', body: '训练时需要摄像头识别头、肩、髋关键点，画面不会上传。' },
  { title: '设置休息提醒', body: '选择工作间隔，到点后浏览器通知你回来训练。' },
  { title: '开始快速体验', body: '从 2 分钟微休息开始，熟悉校准、动作动画和实时反馈。' },
]

export const Onboarding = () => {
  const [settings, setSettings] = useState<AppSettings>(() => readSettings())
  const [stepIndex, setStepIndex] = useState(() => (readSettings().onboardingCompleted ? steps.length : 0))
  const [cameraStatus, setCameraStatus] = useState('未请求')
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>(() =>
    'Notification' in window ? Notification.permission : 'denied',
  )

  if (stepIndex >= steps.length) return null

  const step = steps[stepIndex]

  const close = () => {
    const next = { ...settings, onboardingCompleted: true }
    saveSettings(next)
    setSettings(next)
    setStepIndex(steps.length)
    if (next.reminderEnabled) void scheduleReminder(next)
  }

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      stream.getTracks().forEach((track) => track.stop())
      setCameraStatus('已允许')
    } catch {
      setCameraStatus('未允许，可在训练页重新授权')
    }
  }

  const enableReminder = async () => {
    const permission = await requestNotificationPermission()
    setNotificationStatus(permission)
    const next = { ...settings, reminderEnabled: permission === 'granted' }
    saveSettings(next)
    setSettings(next)
    if (next.reminderEnabled) void scheduleReminder(next)
  }

  return (
    <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <section className="onboarding-panel">
        <div className="onboarding-progress">
          {steps.map((item, index) => (
            <span className={index <= stepIndex ? 'active' : ''} key={item.title} />
          ))}
        </div>
        <p className="eyebrow">新手引导 {stepIndex + 1}/4</p>
        <h2 id="onboarding-title">{step.title}</h2>
        <p>{step.body}</p>

        {stepIndex === 1 && (
          <div className="inline-action-row">
            <button type="button" className="primary-button" onClick={requestCamera}>请求摄像头</button>
            <span>{cameraStatus}</span>
          </div>
        )}

        {stepIndex === 2 && (
          <div className="onboarding-settings">
            <div className="segmented-control">
              {intervals.map((interval) => (
                <button
                  type="button"
                  className={settings.reminderIntervalMinutes === interval ? 'selected' : ''}
                  key={interval}
                  onClick={() => {
                    const next = { ...settings, reminderIntervalMinutes: interval }
                    saveSettings(next)
                    setSettings(next)
                  }}
                >
                  {interval}
                </button>
              ))}
            </div>
            <button type="button" className="primary-button" onClick={enableReminder}>开启提醒</button>
            <span>通知权限：{notificationStatus === 'granted' ? '已允许' : notificationStatus === 'denied' ? '已拒绝' : '未设置'}</span>
          </div>
        )}

        <div className="onboarding-actions">
          <button type="button" onClick={close}>跳过</button>
          {stepIndex === steps.length - 1 ? (
            <Link className="primary-link" to="/train/micro" onClick={close}>开始体验</Link>
          ) : (
            <button type="button" className="primary-button" onClick={() => setStepIndex((index) => index + 1)}>下一步</button>
          )}
        </div>
      </section>
    </div>
  )
}
