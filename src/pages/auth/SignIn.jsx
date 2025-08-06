import { SignInForm } from '../../components/auth/SignInForm'
import { useGuestOnly } from '../../hooks/useAuth'
import { LoadingPage } from '../../components/ui/LoadingSpinner'

export function SignIn() {
  const { loading } = useGuestOnly()

  if (loading) {
    return <LoadingPage message="Checking authentication..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">Arvyax</h1>
          <p className="text-secondary-600">Productivity Management Platform</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}