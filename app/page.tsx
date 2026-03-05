import Link from 'next/link'
import { Button } from '@/components/shared/Button'
import { LandingNav } from '@/components/landing/LandingNav'
import { Lock, BookMarked, Users, BarChart3, Award, Settings, Zap, Cloud, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'CoursePro - Professional Course Management Platform',
  description: 'Enterprise-grade course management platform for administrators and instructors. Secure, scalable, and feature-rich.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNav />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-transparent pointer-events-none" />
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold">✨ The Future of Course Management</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Professional Course <span className="bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">Management</span> Platform
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Enterprise-grade platform for managing courses, instructors, and students. Secure, scalable, and built for educational excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin">
                <Button size="lg" variant="primary" className="w-full sm:w-auto px-8">Admin Dashboard</Button>
              </Link>
              <Link href="/instructor">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8">Instructor Portal</Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 py-12 border-y border-gray-200">
            <StatCard number="10K+" label="Active Users" />
            <StatCard number="500+" label="Courses" />
            <StatCard number="99.9%" label="Uptime" />
          </div>
        </main>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to manage and grow your online learning platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon={Lock}
              title="Enterprise Security"
              description="Role-based access control, JWT authentication, and enterprise-grade encryption for complete data protection."
              color="blue"
            />
            <Feature
              icon={BookMarked}
              title="Course Management"
              description="Create, publish, and manage courses with full control over content, pricing, and enrollment settings."
              color="indigo"
            />
            <Feature
              icon={Users}
              title="User Management"
              description="Manage administrators, instructors, and students with granular permission controls and role assignments."
              color="purple"
            />
            <Feature
              icon={BarChart3}
              title="Real-time Analytics"
              description="Comprehensive insights into course performance, student progress, and revenue metrics at a glance."
              color="blue"
            />
            <Feature
              icon={Award}
              title="Certificates"
              description="Automated certificate generation and tracking for completed courses with customizable templates."
              color="indigo"
            />
            <Feature
              icon={Settings}
              title="System Configuration"
              description="Manage categories, pricing models, system policies, and custom settings all from one dashboard."
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-16">Why Choose CoursePro?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <BenefitItem icon={Zap} title="Lightning Fast" description="Optimized performance with Turbopack and modern infrastructure for instant loading times." />
            <BenefitItem icon={Cloud} title="Cloud Native" description="Fully scalable cloud infrastructure that grows with your platform without downtime." />
            <BenefitItem icon={Lock} title="Security First" description="Industry-leading security practices with regular audits and compliance certifications." />
            <BenefitItem icon={CheckCircle} title="Easy Integration" description="RESTful API and webhooks for seamless integration with your existing tools and systems." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl shadow-xl p-12 md:p-16 text-center text-white">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Platform?</h3>
            <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto">
              Join thousands of educators and administrators using CoursePro to deliver world-class learning experiences.
            </p>
            <Link href="/register">
              <Button size="lg" variant="primary">Create Your Account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-950 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-white font-bold mb-4">CoursePro</h4>
              <p className="text-sm">Professional course management platform for the modern era.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">Security</Link></li>
                <li><Link href="#" className="hover:text-white transition">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 CoursePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Feature({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: any
  title: string
  description: string
  color: string
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
      <div className={`${colorClasses[color]} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{number}</div>
      <p className="text-gray-600 text-sm md:text-base">{label}</p>
    </div>
  )
}

function BenefitItem({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <Icon className="w-8 h-8 text-blue-600 mt-1" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}
