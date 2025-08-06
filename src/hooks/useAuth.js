import { useState, useEffect, createContext, useContext } from 'react'
import { auth, db } from '../lib/supabase'
import { AuthState } from '../types'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    profile: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session
    auth.getCurrentUser().then(({ data: { user } }) => {
      if (user) {
        fetchUserProfile(user)
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setState({
          user: null,
          profile: null,
          loading: false,
          error: null
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (user) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const profile = await db.getProfile(user.id)
      
      setState({
        user,
        profile,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      setState({
        user,
        profile: null,
        loading: false,
        error: error.message
      })
    }
  }

  const signIn = async (email, password) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await auth.signIn(email, password)
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await auth.signUp(email, password, { full_name: fullName })
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await auth.signOut()
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!state.user) throw new Error('No user logged in')
      
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const updatedProfile = await db.updateProfile(state.user.id, updates)
      
      setState(prev => ({
        ...prev,
        profile: updatedProfile,
        loading: false,
        error: null
      }))
      
      return updatedProfile
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      throw error
    }
  }

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!state.user,
    isLoading: state.loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Custom hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/auth/signin'
    }
  }, [user, loading])
  
  return { user, loading }
}

// Custom hook for guest routes (redirect if authenticated)
export function useGuestOnly() {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && user) {
      window.location.href = '/dashboard'
    }
  }, [user, loading])
  
  return { user, loading }
}