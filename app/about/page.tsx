'use client'

import Link from 'next/link'
import { CheckCircle2, Zap, Users, Globe, Brain, TrendingUp, Award, Lightbulb, Target, Rocket, Shield, BarChart3 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

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

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }

        .anim-up { animation: fadeSlideUp 0.6s ease both; }
        .anim-scale { animation: scaleIn 0.6s ease both; }
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
              Empowering instructors<br />
              <span className="text-gray-400">to build the future</span>
            </h1>
            <p className="anim-up text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              CourseProMax is the course management platform for creators who believe education should be simple, secure, and profitable. 
              We remove the technical friction so you can focus on what matters: teaching and inspiring students.
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

        {/* Our Story */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-6">
                Our Story
              </h2>
            </div>
            <div className="space-y-6 text-gray-600 leading-relaxed font-light text-lg">
              <p>
                CourseProMax was born from a simple observation: creating and managing online courses shouldn't require a technical degree. Frustrated instructors were spending their time troubleshooting software instead of teaching. Talented creators were abandoning course ideas because the barriers to entry felt insurmountable.
              </p>
              <p>
                We built CourseProMax to change that. We designed a platform that lets educators focus on what they do best—inspiring and educating students—while we handle the technical complexity behind the scenes. No code required. No learning curve. Just intuitive tools that work the way you expect them to.
              </p>
              <p>
                Today, thousands of instructors use CourseProMax to teach over a million students worldwide. From coding bootcamps to personal development courses, our platform powers diverse learning experiences across every industry imaginable.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-4">
                Our Core Values
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-light">
                These principles guide every decision we make and every feature we build.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Simplicity First',
                  desc: 'We obsess over removing complexity. Every feature is intentional. Every workflow is optimized. We believe the best software gets out of your way.',
                },
                {
                  icon: Shield,
                  title: 'Security & Trust',
                  desc: 'Your data and your students\' data are sacred. We employ enterprise-grade security and transparent privacy practices.',
                },
                {
                  icon: TrendingUp,
                  title: 'Creator Success',
                  desc: 'Your success is our success. We provide the tools, support, and insights you need to build sustainable, profitable courses.',
                },
                {
                  icon: Users,
                  title: 'Community First',
                  desc: 'We\'re building with and for our users. Your feedback shapes our roadmap, and we celebrate your achievements as our own.',
                },
                {
                  icon: Lightbulb,
                  title: 'Innovation',
                  desc: 'We stay at the forefront of education technology, continuously improving to serve your evolving needs.',
                },
                {
                  icon: Globe,
                  title: 'Accessibility',
                  desc: 'Education should be borderless. We support creators and learners around the world with global payment systems and local support.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-400 transition-all hover:shadow-sm" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-white mb-4">
                    <item.icon size={20} />
                  </div>
                  <h3 style={syne} className="font-bold mb-3 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-4">
                Our Impact By The Numbers
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { stat: '5.2K+', label: 'Active Instructors' },
                { stat: '1.2M+', label: 'Students Worldwide' },
                { stat: '$48M+', label: 'Instructor Earnings' },
                { stat: '99.9%', label: 'Platform Uptime' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center">
                  <div style={{ ...syne, fontSize: 'clamp(28px, 4vw, 40px)' }} className="font-black text-black tracking-tight mb-2">
                    {item.stat}
                  </div>
                  <p className="text-sm text-gray-600 font-light">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why We Exist */}
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-6">
                Why We Exist
              </h2>
            </div>
            <div className="space-y-6 text-gray-600 leading-relaxed font-light text-lg">
              <p>
                The world needs more educators sharing knowledge online. But there's a gap between vision and execution—between wanting to create courses and actually building a sustainable income from them.
              </p>
              <p>
                CourseProMax closes that gap. We believe educators shouldn't have to battle technology while trying to inspire students. They shouldn't have to choose between powerful features and ease of use. They shouldn't have to sacrifice security for simplicity.
              </p>
              <p>
                We exist to level the playing field. Whether you're a university professor teaching in the digital age, a consultant scaling your expertise, or an entrepreneur building your first online business, CourseProMax gives you enterprise-grade tools without the enterprise complexity.
              </p>
              <p>
                Every day, our team wakes up focused on one goal: making it easier for creators to build, deliver, and profit from their knowledge.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-4">
                Designed for Success
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-light">
                Here's what makes CourseProMax the platform educators choose.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'Smart Analytics',
                  desc: 'Understand student behavior, track completion rates, and identify improvement areas with intuitive dashboards.',
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  desc: 'Built on modern infrastructure, our platform loads instantly and handles thousands of concurrent users.',
                },
                {
                  icon: BarChart3,
                  title: 'Revenue Tracking',
                  desc: 'Real-time earning reports, multiple payment gateways, and transparent fee structures.',
                },
                {
                  icon: Award,
                  title: 'Certifications',
                  desc: 'Create branded certificates that validate student achievement and add value to your courses.',
                },
                {
                  icon: Rocket,
                  title: 'Marketing Tools',
                  desc: 'Built-in tools for email campaigns, student engagement, and course promotion.',
                },
                {
                  icon: Shield,
                  title: 'Enterprise Security',
                  desc: 'SSL encryption, data backups, GDPR compliance, and comprehensive privacy controls.',
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

        {/* Remonode Backing */}
        <section className="py-20 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h3 style={{ ...syne, fontSize: 'clamp(24px, 3vw, 32px)' }} className="font-black tracking-tighter mb-4">
              Backed by Remonode
            </h3>
            <p className="text-gray-600 font-light leading-relaxed text-lg">
              CourseProMax is developed and maintained by <strong className="text-black">Remonode</strong>, a forward-thinking technology company specializing in educational and productivity software. 
              With a team of experienced engineers and designers, Remonode has a proven track record of building scalable, user-centric platforms.
            </p>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="py-32 px-6 md:px-12 bg-black text-white border-b border-neutral-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 style={{ ...syne, fontSize: 'clamp(36px, 5vw, 52px)' }} className="font-black tracking-tighter mb-6 leading-tight">
              Ready to transform how you teach?
            </h2>
            <p className="text-lg text-neutral-400 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Join thousands of educators who've chosen CourseProMax as their platform of choice. Start creating courses, building your audience, and earning revenue today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-white text-black px-9 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity no-underline text-base"
              >
                Get Started for Free
              </Link>
              <Link
                href="/"
                className="border-2 border-neutral-600 text-white px-9 py-4 rounded-lg font-medium hover:border-neutral-400 transition-colors no-underline text-base"
              >
                Back to Home
              </Link>
            </div>
            <p className="mt-8 text-xs text-neutral-600">No credit card required • 14-day trial • Cancel anytime</p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h3 style={{ ...syne, fontSize: 'clamp(28px, 4vw, 40px)' }} className="font-black tracking-tighter mb-12">
              Let's Stay Connected
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: 'General Inquiries', value: 'hello@remonode.com', desc: 'Questions or feedback' },
                { label: 'Sales & Partnerships', value: 'sales@remonode.com', desc: 'Enterprise plans & integrations' },
                { label: 'Support & Help', value: 'support@remonode.com', desc: 'Technical assistance' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-white transition-all">
                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-widest mb-2">
                    {item.label}
                  </p>
                  <a href={`mailto:${item.value}`} className="text-base font-semibold text-black hover:text-gray-600 transition-colors no-underline block mb-2">
                    {item.value}
                  </a>
                  <p className="text-xs text-gray-500 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 font-light mt-12">
              We're here to help. Response time: typically within 24 hours.
            </p>
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