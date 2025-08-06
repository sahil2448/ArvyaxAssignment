import { useState } from 'react'
import { Camera, Mail, MapPin, Globe, Calendar, Edit } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useNotifications } from '../hooks/useNotifications'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { generateAvatarUrl, validateRequired, validateUrl } from '../lib/utils'
import { formatDate } from '../types'

export function Profile() {
  const { user, profile, updateProfile, loading } = useAuth()
  const { success, error } = useNotifications()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: ''
  })
  const [errors, setErrors] = useState({})

  const handleEditClick = () => {
    setFormData({
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      website: profile?.website || '',
      avatar_url: profile?.avatar_url || ''
    })
    setErrors({})
    setIsEditModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!validateRequired(formData.full_name)) {
      newErrors.full_name = 'Full name is required'
    }

    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL'
    }

    if (formData.avatar_url && !validateUrl(formData.avatar_url)) {
      newErrors.avatar_url = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setIsUpdating(true)
      await updateProfile(formData)
      success('Profile updated successfully!')
      setIsEditModalOpen(false)
    } catch (err) {
      error('Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const avatarUrl = profile?.avatar_url || generateAvatarUrl(profile?.full_name || user?.email || 'User')

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
        <p className="text-secondary-600 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-2 right-2 h-8 w-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900">
                    {profile?.full_name || 'User'}
                  </h2>
                  <p className="text-secondary-600">{user?.email}</p>
                </div>
                <Button onClick={handleEditClick}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {profile?.bio && (
                <p className="text-secondary-700 mb-4">{profile.bio}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {profile?.location && (
                  <div className="flex items-center text-secondary-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {profile.location}
                  </div>
                )}
                
                {profile?.website && (
                  <div className="flex items-center text-secondary-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center text-secondary-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </div>
                
                <div className="flex items-center text-secondary-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {formatDate(user?.created_at)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-secondary-700">Email</label>
              <p className="text-secondary-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-700">Account Created</label>
              <p className="text-secondary-900">{formatDate(user?.created_at)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-700">Last Sign In</label>
              <p className="text-secondary-900">{formatDate(user?.last_sign_in_at)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-secondary-700">Theme</label>
              <p className="text-secondary-900">Light</p>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-700">Language</label>
              <p className="text-secondary-900">English</p>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-700">Timezone</label>
              <p className="text-secondary-900">
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

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

            {errors.submit && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-3">
                <p className="text-sm text-error-700">{errors.submit}</p>
              </div>
            )}
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