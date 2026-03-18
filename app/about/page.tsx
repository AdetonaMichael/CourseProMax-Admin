'use client'

import Link from 'next/link'
import { CheckCircle2, Zap, Users, Globe, Brain, TrendingUp } from 'lucide-react'

export default function About() {
  const syne = { fontFamily: "'Syne', sans-serif" }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap');

        body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .anim-up { animation: fadeSlideUp 0.6s ease both; }
      `}</style>

      <div className="min-h-screen bg-white text-black overflow-x-hidden">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <Link
            href="/"
            style={syne}
            className="font-black text-lg tracking-tight text-black no-underline whitespace-nowrap"
          >
            CourseProMax
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors no-underline">
            Back to Home
          </Link>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-24 px-6 md:px-12 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h1 style={{ ...syne, fontSize: 'clamp(40px, 6vw, 56px)' }} className="anim-up font-black leading-none tracking-tighter mb-6">
              Build, manage, and scale<br />
              <span className="text-gray-400">your courses with confidence</span>
            </h1>
            <p className="anim-up text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              CourseProMax is a modern platform designed to help instructors create, manage, and monetize courses without unnecessary complexity. 
              It provides the tools you need to focus on delivering value to your students.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
              <h2 style={{ ...syne, fontSize: 'clamp(28px, 4vw, 40px)' }} className="font-black tracking-tighter mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed font-light">
                To simplify the process of building and managing online courses by providing reliable, intuitive tools that remove technical barriers 
                and allow instructors to focus on teaching.
              </p>
            </div>

            <div>
              <h2 style={{ ...syne, fontSize: 'clamp(28px, 4vw, 40px)' }} className="font-black tracking-tighter mb-6">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed font-light">
                To become a trusted platform for educators and creators looking to build sustainable digital products and reach learners globally 
                without unnecessary friction.
              </p>
            </div>
          </div>
        </section>

        {/* Value */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-4">
                Why CourseProMax?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-light">
                Practical tools designed to help you run and grow your courses efficiently.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'Smart Insights',
                  desc: 'Understand student engagement and performance with actionable analytics.',
                },
                {
                  icon: Zap,
                  title: 'Fast & Reliable',
                  desc: 'A responsive platform built for smooth course delivery and management.',
                },
                {
                  icon: TrendingUp,
                  title: 'Earnings Visibility',
                  desc: 'Track your course performance and revenue in one place.',
                },
                {
                  icon: Users,
                  title: 'Student Experience',
                  desc: 'Provide learners with a clean and structured learning environment.',
                },
                {
                  icon: Globe,
                  title: 'Global Reach',
                  desc: 'Deliver your courses to learners anywhere without added complexity.',
                },
                {
                  icon: CheckCircle2,
                  title: 'Secure & Stable',
                  desc: 'Built with modern best practices to keep your data safe and accessible.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-white mb-4">
                    <item.icon size={20} />
                  </div>
                  <h3 style={syne} className="font-bold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Minimal Remonode */}
        <section className="py-20 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 font-light leading-relaxed">
              CourseProMax is a product of <strong className="text-black">Remonode</strong>, 
              a technology company focused on building scalable digital tools for modern businesses and creators.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 md:px-12 bg-black text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-4">
              Start building your course
            </h2>
            <p className="text-neutral-400 mb-10 font-light">
              Create, manage, and grow your courses with a platform designed to keep things simple and effective.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-white text-black px-8 py-3.5 rounded-lg font-medium hover:opacity-90 transition-opacity no-underline"
              >
                Get Started
              </Link>
              <Link
                href="/demo"
                className="border border-neutral-600 px-8 py-3.5 rounded-lg font-medium hover:border-neutral-400 transition-colors no-underline"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 px-6 md:px-12 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h3 style={syne} className="font-black mb-8">
              Contact
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: 'Support', value: 'support@remonode.com' },
                { label: 'Sales', value: 'sales@remonode.com' },
                { label: 'General', value: 'hello@remonode.com' },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-widest mb-2">
                    {item.label}
                  </p>
                  <a href={`mailto:${item.value}`} className="font-medium hover:opacity-70 transition-opacity no-underline">
                    {item.value}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-neutral-600 px-8 md:px-12 py-12 border-t border-neutral-900">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pb-6 border-b border-neutral-900">
              <p className="text-xs">&copy; 2026 CourseProMax. All rights reserved.</p>
              <div className="flex gap-6">
                {[
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Terms', href: '/terms' },
                  { label: 'Cookies', href: '/privacy#cookies-and-tracking' }
                ].map(link => (
                  <a key={link.label} href={link.href} className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors no-underline">{link.label}</a>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center mt-6 pt-6">
              <p className="text-xs text-neutral-700">Powered by <span className="text-neutral-500 font-semibold">Remonode</span></p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}