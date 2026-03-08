'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/shared/Button'
import { LandingNav } from '@/components/landing/LandingNav'
import { ArrowRight, Zap, Shield, Users, BarChart3, Globe, Lightbulb } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <LandingNav />

      {/* ===== HERO SECTION WITH BACKGROUND IMAGE ===== */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            {/* Tagline */}
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition">
              <span className="text-white text-sm font-semibold">✨ Next Generation Course Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
              Elevate Your
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-white bg-clip-text text-transparent">
                Learning Platform
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              Enterprise-grade course management with the elegance of luxury. Manage instructors, courses, and students with unprecedented simplicity and power.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin" className="group">
                <Button size="lg" variant="primary" className="w-full sm:w-auto px-8 flex items-center gap-2 bg-white text-black hover:bg-gray-100">
                  Explore Admin
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/instructor">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 bg-white/20 text-white border border-white/30 hover:bg-white/30 transition">
                  Instructor Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 z-10 animate-bounce">
          <svg className="w-6 h-6 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard number="50K+" label="Active Learners" delay="delay-100" />
            <StatCard number="2K+" label="Courses Live" delay="delay-200" />
            <StatCard number="99.99%" label="Uptime SLA" delay="delay-300" />
          </div>
        </div>
      </section>

      {/* ===== HORIZONTALLY SCROLLABLE FEATURES CARDS ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Comprehensive tools designed to scale your educational vision
            </p>
          </div>

          {/* Scrollable Container */}
          <div className="overflow-x-auto pb-4 scroll-smooth">
            <div className="flex gap-6 min-w-max">
              <FeatureCard
                icon={Zap}
                title="Lightning Performance"
                description="Turbopack-powered platform with sub-second load times. Built for speed."
                bgColor="from-blue-500 to-cyan-500"
              />
              <FeatureCard
                icon={Shield}
                title="Enterprise Security"
                description="JWT authentication, role-based access, and enterprise-grade encryption."
                bgColor="from-purple-500 to-pink-500"
              />
              <FeatureCard
                icon={BarChart3}
                title="Real-time Analytics"
                description="Comprehensive dashboards with student progress, revenue, and engagement metrics."
                bgColor="from-orange-500 to-red-500"
              />
              <FeatureCard
                icon={Users}
                title="User Management"
                description="Manage instructors, admins, and students with granular permissions and roles."
                bgColor="from-green-500 to-emerald-500"
              />
              <FeatureCard
                icon={Globe}
                title="Global Scale"
                description="Cloud-native architecture that scales infinitely without compromising performance."
                bgColor="from-indigo-500 to-blue-500"
              />
              <FeatureCard
                icon={Lightbulb}
                title="Smart Automation"
                description="Automated workflows, certificate generation, and intelligent enrollment management."
                bgColor="from-yellow-500 to-orange-500"
              />
            </div>
          </div>

          {/* Scroll Hint */}
          <p className="text-center text-gray-500 text-sm mt-8">← Scroll for more features →</p>
        </div>
      </section>

      {/* ===== HIGHLIGHTS SECTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            Designed for Excellence
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <HighlightBlock
              title="Intuitive Admin Dashboard"
              description="Manage everything from a single elegant interface. Course creation, enrollment tracking, revenue analytics—all at your fingertips."
              points={["Real-time course analytics", "Student enrollment tracking", "Revenue dashboard", "User management tools"]}
            />
            <HighlightBlock
              title="Instructor Empowerment"
              description="Give instructors the tools to thrive. Built-in course editor, student communication, and performance insights."
              points={["Course creation & editing", "Student communication", "Progress tracking", "Certificate management"]}
            />
            <HighlightBlock
              title="Security & Compliance"
              description="Enterprise-grade security meets regulatory compliance. Your data is protected with industry-leading encryption and practices."
              points={["JWT authentication", "Role-based access control", "Data encryption", "Audit logging"]}
            />
            <HighlightBlock
              title="Scalable Infrastructure"
              description="From 10 students to 10 million. Our cloud-native platform grows with you effortlessly, maintaining performance always."
              points={["Auto-scaling", "99.99% uptime", "CDN integration", "Global reach"]}
            />
          </div>
        </div>
      </section>

      {/* ===== LUXURY CTA SECTION ===== */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/3808517/pexels-photo-3808517.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="CTA background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Transform Your Educational Vision
          </h2>
          <p className="text-xl text-gray-200 mb-10 font-light">
            Join forward-thinking educators and administrators who've already revolutionized their platforms with CourseProMax.
          </p>
          <Link href="/register">
            <Button size="lg" variant="primary" className="px-10 flex items-center gap-2 mx-auto bg-white text-black hover:bg-gray-100">
              Start Your Journey
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="text-white font-bold mb-4 text-lg">CourseProMax</h4>
              <p className="text-sm leading-relaxed">The epitome of course management excellence. Enterprise power. Luxury design.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition">Security</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">API</Link></li>
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
                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 CourseProMax. Crafted with excellence.</p>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  )
}

function StatCard({ number, label, delay }: { number: string; label: string; delay: string }) {
  return (
    <div className={`text-center animate-fade-in-up ${delay}`}>
      <div className="text-4xl md:text-5xl font-black text-black mb-3">{number}</div>
      <p className="text-gray-600 text-lg">{label}</p>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  bgColor,
}: {
  icon: any
  title: string
  description: string
  bgColor: string
}) {
  return (
    <div className="min-w-[350px] group">
      <div className={`bg-gradient-to-br ${bgColor} rounded-2xl p-8 h-full text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
        <div className="mb-6 p-4 bg-white/20 rounded-xl w-fit group-hover:bg-white/30 transition">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-white/90 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function HighlightBlock({
  title,
  description,
  points,
}: {
  title: string
  description: string
  points: string[]
}) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
              ✓
            </div>
            <span className="text-gray-700">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
