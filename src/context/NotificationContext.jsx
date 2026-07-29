import { createContext, useCallback, useContext, useState } from 'react'
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const notify = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setNotifications((items) => [...items, { id, message, type }])
    window.setTimeout(() => setNotifications((items) => items.filter((item) => item.id !== id)), 4500)
  }, [])

  const dismiss = useCallback((id) => setNotifications((items) => items.filter((item) => item.id !== id)), [])

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed right-4 top-20 z-[70] w-[min(24rem,calc(100vw-2rem))] space-y-3">
        {notifications.map((item) => (
          <div key={item.id} className={`flex items-start gap-3 rounded-2xl border p-4 shadow-xl ${item.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-emerald-200 bg-white text-slate-800'}`}>
            {item.type === 'error' ? <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" /> : <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />}
            <p className="flex-1 text-sm font-medium">{item.message}</p>
            <button type="button" onClick={() => dismiss(item.id)} className="text-slate-400 hover:text-slate-700" aria-label="Dismiss notification"><FiX /></button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotification must be used within NotificationProvider')
  return context
}
