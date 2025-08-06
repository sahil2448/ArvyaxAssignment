import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { NotificationContainer } from '../ui/Notification'
import { useNotifications } from '../../hooks/useNotifications'

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Notifications */}
      <NotificationContainer 
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  )
}