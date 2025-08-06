import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function to merge Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Generate random ID
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Debounce function
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Capitalize first letter
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Truncate text
export function truncate(str, length = 100) {
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}

// Generate avatar URL
export function generateAvatarUrl(name) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3b82f6&color=ffffff&size=128`
}

// Format currency
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Format number
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num)
}

// Get relative time
export function getRelativeTime(date) {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now - target) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  return `${Math.floor(diffInSeconds / 31536000)}y ago`
}

// Check if date is today
export function isToday(date) {
  const today = new Date()
  const target = new Date(date)
  return today.toDateString() === target.toDateString()
}

// Check if date is this week
export function isThisWeek(date) {
  const today = new Date()
  const target = new Date(date)
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
  return target >= startOfWeek && target <= endOfWeek
}

// Generate color from string
export function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}

// Copy to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

// Download file
export function downloadFile(data, filename, type = 'application/json') {
  const blob = new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Validate form data
export function validateForm(data, schema) {
  const errors = {}
  
  Object.entries(schema).forEach(([field, rules]) => {
    const value = data[field]
    
    if (rules.required && !value) {
      errors[field] = `${capitalize(field)} is required`
      return
    }
    
    if (value && rules.minLength && value.length < rules.minLength) {
      errors[field] = `${capitalize(field)} must be at least ${rules.minLength} characters`
      return
    }
    
    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `${capitalize(field)} must be no more than ${rules.maxLength} characters`
      return
    }
    
    if (value && rules.enum && !rules.enum.includes(value)) {
      errors[field] = `${capitalize(field)} must be one of: ${rules.enum.join(', ')}`
      return
    }
    
    if (value && rules.type === 'email' && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email address'
      return
    }
    
    if (value && rules.type === 'url' && !validateUrl(value)) {
      errors[field] = 'Please enter a valid URL'
      return
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Sleep function for testing
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Generate random color palette
export function generateColorPalette() {
  const hue = Math.floor(Math.random() * 360)
  return {
    primary: `hsl(${hue}, 70%, 50%)`,
    secondary: `hsl(${(hue + 120) % 360}, 70%, 50%)`,
    accent: `hsl(${(hue + 240) % 360}, 70%, 50%)`
  }
}

// Check if user is online
export function isOnline() {
  return navigator.onLine
}

// Get device type
export function getDeviceType() {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// Format phone number
export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Generate slug from string
export function generateSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Check if object is empty
export function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

// Deep clone object
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// Merge objects deeply
export function deepMerge(target, source) {
  const result = { ...target }
  
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  })
  
  return result
}

// Get contrast color
export function getContrastColor(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}