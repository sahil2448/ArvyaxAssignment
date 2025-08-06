import { useState } from 'react'
import { 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Trash2,
  Key,
  Smartphone
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { useAuth } from '../hooks/useAuth'
import { useNotifications } from '../hooks/useNotifications'
import { useLocalStorage } from '../hooks/useLocalStorage'

export function Settings() {
  const { user, signOut } = useAuth()
  const { success, error } = useNotifications()
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'en')
  const [notifications, setNotifications] = useLocalStorage('notifications', {
    email: true,
    push: true,
    desktop: true,
    marketing: false
  })

  const handleNotificationChange = (type, value) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }))
    success('Notification preferences updated!')
  }

  const handleExportData = () => {
    // This would typically export user data
    success('Data export initiated! You will receive an email when ready.')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      error('Account deletion is not implemented in this demo.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </Select>

            <Select
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900">Email Notifications</h4>
                <p className="text-sm text-secondary-600">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900">Push Notifications</h4>
                <p className="text-sm text-secondary-600">Receive push notifications on your devices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900">Desktop Notifications</h4>
                <p className="text-sm text-secondary-600">Show notifications on your desktop</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.desktop}
                  onChange={(e) => handleNotificationChange('desktop', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900">Marketing Emails</h4>
                <p className="text-sm text-secondary-600">Receive updates about new features and tips</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={(e) => handleNotificationChange('marketing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-secondary-900">Password</h4>
              <p className="text-sm text-secondary-600">Last updated 30 days ago</p>
            </div>
            <Button variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-secondary-900">Two-Factor Authentication</h4>
              <p className="text-sm text-secondary-600">Add an extra layer of security</p>
            </div>
            <Button variant="outline">
              <Smartphone className="h-4 w-4 mr-2" />
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-secondary-900">Export Data</h4>
              <p className="text-sm text-secondary-600">Download a copy of your data</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-error-900">Delete Account</h4>
              <p className="text-sm text-error-600">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <ModalBody className="space-y-6">
            <Input
              name="full_name"
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              error={errors.full_name}
              required
            />

            <Textarea
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={handleChange}
              error={errors.bio}
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="location"
                label="Location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                leftIcon={<MapPin className="h-4 w-4" />}
              />

              <Input
                name="website"
                label="Website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
                error={errors.website}
                leftIcon={<Globe className="h-4 w-4" />}
              />
            </div>

            <Input
              name="avatar_url"
              label="Avatar URL"
              placeholder="https://example.com/avatar.jpg"
              value={formData.avatar_url}
              onChange={handleChange}
              error={errors.avatar_url}
              leftIcon={<Camera className="h-4 w-4" />}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isUpdating}
              disabled={isUpdating}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  )
}