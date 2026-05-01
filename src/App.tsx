import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Onboarding } from './components/Onboarding'
import { Complete } from './pages/Complete'
import { History } from './pages/History'
import { Home } from './pages/Home'
import { Settings } from './pages/Settings'
import { Train } from './pages/Train'
import { cancelReminder, scheduleReminder } from './utils/reminders'
import { readSettings } from './utils/storage'

function App() {
  useEffect(() => {
    const settings = readSettings()
    if (settings.reminderEnabled) {
      void scheduleReminder(settings)
      return
    }
    void cancelReminder()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/train/:id" element={<Train />} />
        <Route path="/complete" element={<Complete />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Onboarding />
    </BrowserRouter>
  )
}

export default App
