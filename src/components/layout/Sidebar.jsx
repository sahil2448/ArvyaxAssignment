import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  User,
  Plus,
  Calendar,
  Target
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: CheckSquare
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderOpen
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: Target
  }
]

const secondaryNavigation = [
  {
    name: 'Profile',
    href: '/profile',
    icon: User
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }
]

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-secondary-200">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-secondary-900">Arvyax</span>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-secondary-200">
            <div className="space-y-2">
              <Button className="w-full justify-start" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActivePath(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                  )}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Secondary Navigation */}
          <div className="px-4 py-4 border-t border-secondary-200">
            <div className="space-y-1">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActivePath(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                    )}
                    onClick={onClose}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}