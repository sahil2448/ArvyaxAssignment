import { Link } from 'react-router-dom'
import { 
  CheckSquare, 
  FolderOpen, 
  BarChart3, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  Star,
  Play
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'

const features = [
  {
    icon: CheckSquare,
    title: 'Task Management',
    description: 'Create, organize, and track your tasks with powerful filtering and sorting options.'
  },
  {
    icon: FolderOpen,
    title: 'Project Organization',
    description: 'Group related tasks into projects and monitor progress with visual dashboards.'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Get detailed insights into your productivity patterns and performance metrics.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together with your team members and share projects seamlessly.'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Stay synchronized across all your devices with real-time data synchronization.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security and privacy controls.'
  }
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    content: 'Arvyax has transformed how our team manages projects. The analytics features are incredibly insightful.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Freelance Designer',
    company: 'Independent',
    content: 'Perfect for managing multiple client projects. The interface is clean and intuitive.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Startup Founder',
    company: 'InnovateLab',
    content: 'The best productivity tool we\'ve used. It scales perfectly as our team grows.',
    rating: 5
  }
]

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-secondary-900">Arvyax</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Supercharge Your
              <span className="text-primary-600 block">Productivity</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              The ultimate task and project management platform designed to help individuals and teams achieve more with intelligent organization and powerful analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Hero Image/Demo */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl border border-secondary-200 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-primary-200 bg-primary-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckSquare className="h-5 w-5 text-primary-600" />
                        <span className="font-medium text-primary-900">Tasks</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-primary-200 rounded"></div>
                        <div className="h-2 bg-primary-200 rounded w-3/4"></div>
                        <div className="h-2 bg-primary-200 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-success-200 bg-success-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <FolderOpen className="h-5 w-5 text-success-600" />
                        <span className="font-medium text-success-900">Projects</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-success-200 rounded"></div>
                        <div className="h-2 bg-success-200 rounded w-2/3"></div>
                        <div className="h-2 bg-success-200 rounded w-4/5"></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-accent-200 bg-accent-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <BarChart3 className="h-5 w-5 text-accent-600" />
                        <span className="font-medium text-accent-900">Analytics</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-accent-200 rounded w-5/6"></div>
                        <div className="h-2 bg-accent-200 rounded"></div>
                        <div className="h-2 bg-accent-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Everything you need to stay productive
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Powerful features designed to help you organize, prioritize, and accomplish your goals efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="h-16 w-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Loved by thousands of users
            </h2>
            <p className="text-xl text-secondary-600">
              See what our users have to say about Arvyax
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-warning-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-secondary-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-secondary-900">{testimonial.name}</p>
                    <p className="text-sm text-secondary-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
            Ready to boost your productivity?
          </h2>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already transformed their workflow with Arvyax.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth/signup">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/auth/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold">Arvyax</span>
              </div>
              <p className="text-secondary-400">
                The ultimate productivity platform for modern teams and individuals.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
            <p>&copy; 2024 Arvyax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}