'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp, BookOpen, Users, Award, Brain, Play, BarChart2, Star, Layers } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000, started = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!started) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, started])
  return count
}

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

// ─── Components ───────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { ref, inView } = useInView()
  const count = useCounter(value, 2000, inView)
  return (
    <div ref={ref} className="text-center px-6 border-r border-gray-200 last:border-r-0" style={{ animationDelay: `${delay}ms` }}>
      <div style={{ fontFamily: "'Syne', sans-serif" }} className="text-5xl font-black text-black tracking-tight leading-none">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-sm text-gray-500 mt-2">{label}</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, index }: { icon: any; title: string; desc: string; index: number }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={`bg-white p-8 relative group cursor-default transition-all duration-500 hover:bg-gray-50 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center text-white mb-5 shrink-0">
        <Icon size={16} />
      </div>
      <h3 className="text-base font-bold text-black mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed font-light">{desc}</p>
      <div className="absolute bottom-5 right-5 text-gray-200 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
        <ArrowRight size={14} />
      </div>
    </div>
  )
}

function DashboardPreview() {
  const { ref, inView } = useInView(0.2)
  const bars = [65, 80, 45, 90, 70, 85, 55, 75, 60, 88, 72, 95]
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D']

  return (
    <div
      ref={ref}
      className={`bg-black rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl transition-all duration-700 ${inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'}`}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
        </div>
        <span className="flex-1 text-center text-xs text-neutral-600">CourseProMax — Instructor Dashboard</span>
        <span className="text-xs text-green-400">● Live</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 border-b border-neutral-800">
        {[
          { label: 'Revenue', value: '$24,580', change: '+12.4%' },
          { label: 'Students', value: '1,284', change: '+8.1%' },
          { label: 'Courses', value: '18', change: '+2' },
          { label: 'Completion', value: '87%', change: '+3.2%' },
        ].map((s, i) => (
          <div key={i} className="p-3 border-r border-neutral-800 last:border-r-0">
            <p className="text-xs text-neutral-600 mb-1 truncate">{s.label}</p>
            <p className="text-base font-bold text-white tracking-tight">{s.value}</p>
            <p className="text-xs text-green-400 mt-0.5">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-neutral-400 font-medium">Earnings Overview</span>
          <span className="text-xs text-neutral-600">Last 12 months</span>
        </div>
        <div className="flex items-end gap-1 h-20">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex items-end h-full">
              <div
                className="w-full bg-white opacity-80"
                style={{
                  height: inView ? `${h}%` : '0%',
                  transition: `height 0.5s ease ${i * 80 + 600}ms`,
                  borderRadius: '2px 2px 0 0'
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {months.map((m, i) => (
            <span key={i} className="text-xs text-neutral-700 flex-1 text-center">{m}</span>
          ))}
        </div>
      </div>

      {/* AI strip */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-950 border-t border-neutral-800">
        <Brain size={13} className="text-neutral-500 shrink-0" />
        <span className="text-xs text-neutral-500 leading-relaxed">
          AI suggests: <strong className="text-white font-medium">Add a React Advanced module</strong> — 340 students nearby are looking for it
        </span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
        }

        .anim-up          { animation: fadeSlideUp 0.6s ease both; }
        .anim-up-d1       { animation: fadeSlideUp 0.6s 0.1s ease both; }
        .anim-up-d2       { animation: fadeSlideUp 0.6s 0.2s ease both; }
        .anim-up-d3       { animation: fadeSlideUp 0.6s 0.3s ease both; }
        .anim-up-d10      { animation: fadeSlideUp 0.6s 1s ease both; opacity: 0; }
        .anim-scroll-line { animation: scrollLine 1.5s ease infinite; }
        .anim-pulse-dot   { animation: pulseDot 2s ease infinite; }

        .hero-grid {
          background-image:
            linear-gradient(#e8e8e8 1px, transparent 1px),
            linear-gradient(90deg, #e8e8e8 1px, transparent 1px);
          background-size: 60px 60px;
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
        }

        /* Dividers between feature cards */
        .feature-grid-cell + .feature-grid-cell { border-left: 1px solid #e8e8e8; }
        @media (max-width: 768px) {
          .feature-grid-cell + .feature-grid-cell { border-left: none; border-top: 1px solid #e8e8e8; }
        }
      `}</style>

      <div className="min-h-screen bg-white text-black overflow-x-hidden">

        {/* ── NAV ── */}
        <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 h-16 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200' : ''}`}>
          <Link
            href="/"
            style={syne}
            className="font-black text-lg tracking-tight text-black no-underline whitespace-nowrap"
          >
            CourseProMax
          </Link>
          <ul className="hidden md:flex items-center gap-8 list-none">
            {['Features', 'Dashboard', 'AI Engine', 'Pricing'].map(l => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(' ', '-')}`} className="text-sm text-gray-500 hover:text-black transition-colors no-underline">
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a href="/admin" className="hidden sm:block text-sm font-medium text-black border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-100 hover:border-gray-300 transition-all no-underline">
              Sign In
            </a>
            <a href="/register" className="text-sm font-medium text-white bg-black px-4 py-2 rounded-md hover:opacity-80 transition-opacity flex items-center gap-1.5 no-underline">
              Get Started <ArrowRight size={13} />
            </a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-24 overflow-hidden bg-white">
          <div className="hero-grid absolute inset-0 opacity-50 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
           

            {/* Headline */}
            <h1
              className="anim-up-d1 font-black text-black leading-none tracking-tighter mb-6"
              style={{ ...syne, fontSize: 'clamp(48px, 7vw, 88px)' }}
            >
              Teach Smarter.<br />
              <span className="text-gray-300">Earn More.</span>
            </h1>

            {/* Subheading */}
            <p className="anim-up-d2 text-lg text-gray-500 font-light leading-relaxed max-w-xl mx-auto mb-10">
              The instructor dashboard that thinks with you — manage courses, track earnings, and let AI surface what your students need next.
            </p>

            {/* CTAs */}
            <div className="anim-up-d3 flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
              <a href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-white bg-black px-6 py-3 rounded-lg hover:opacity-80 active:scale-95 transition-all no-underline">
                Open Dashboard <ArrowRight size={15} />
              </a>
              <a href="/demo" className="inline-flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-6 py-3 rounded-lg hover:border-gray-400 hover:text-black transition-all no-underline">
                <Play size={13} /> Watch Demo
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="anim-up-d10 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase text-gray-400">scroll</span>
            <div className="w-px h-8 bg-gray-300 anim-scroll-line" />
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-20 px-6 bg-gray-50 border-t border-b border-gray-200">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-0">
            <StatCard value={50000} suffix="+" label="Active Learners" delay={0} />
            <StatCard value={2000}  suffix="+" label="Courses Published" delay={100} />
            <StatCard value={99}    suffix="%" label="Uptime SLA" delay={200} />
            <StatCard value={4800}  suffix="+" label="Instructors Earning" delay={300} />
          </div>
        </section>

        {/* ── DASHBOARD PREVIEW ── */}
        <section className="py-24 px-6 bg-white" id="dashboard">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Instructor Dashboard</p>
              <h2
                className="font-black text-black leading-none tracking-tighter mb-5"
                style={{ ...syne, fontSize: 'clamp(32px, 4vw, 52px)' }}
              >
                Everything in<br />one view.
              </h2>
              <p className="text-base text-gray-500 font-light leading-relaxed mb-8 max-w-sm">
                Track your revenue, monitor student performance, and manage your entire course catalogue — all from a single focused interface.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  'Real-time earnings with monthly breakdowns',
                  'Student completion and engagement rates',
                  'Course performance benchmarking',
                  'AI-generated content recommendations',
                  'Certificate management and delivery',
                ].map((pt, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="w-1 h-1 rounded-full bg-black shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <DashboardPreview />
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-24 px-6 bg-gray-50 border-t border-gray-200" id="features">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Platform Features</p>
                <h2
                  className="font-black text-black leading-none tracking-tighter"
                  style={{ ...syne, fontSize: 'clamp(32px, 4vw, 52px)' }}
                >
                  Built for instructors.
                </h2>
              </div>
              <a href="/features" className="text-sm font-medium text-black border border-gray-200 px-4 py-2 rounded-md hover:bg-white hover:border-gray-300 transition-all no-underline w-fit whitespace-nowrap">
                View all features
              </a>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {[
                  { icon: TrendingUp, title: 'Earnings Tracking',    desc: 'Detailed revenue analytics with payout history, trends, and forecasting across all your courses.' },
                  { icon: Users,      title: 'Student Performance',  desc: 'Monitor progress, completion rates, quiz scores, and engagement patterns at scale.' },
                  { icon: BookOpen,   title: 'Course Management',    desc: 'Upload lessons, organise categories, set pricing, and manage content versioning with ease.' },
                  { icon: Award,      title: 'Certifications',       desc: 'Auto-generate branded certificates on course completion. Fully customisable templates.' },
                  { icon: BarChart2,  title: 'Analytics Suite',      desc: 'Comprehensive reporting on course performance, student retention, and revenue attribution.' },
                  { icon: Layers,     title: 'Assignment Builder',   desc: 'Create quizzes and assessments with automated grading and instant feedback tools.' },
                ].map((f, i) => (
                  <div key={i} className={`feature-grid-cell ${i >= 3 ? 'border-t border-gray-200' : ''}`}>
                    <FeatureCard icon={f.icon} title={f.title} desc={f.desc} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── AI SECTION ── */}
        <section className="py-24 px-6 bg-black" id="ai-engine">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">

            {/* Left — text */}
            <div className="flex flex-col">
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-600 mb-4">AI Engine</p>
              <h2
                className="font-black text-white leading-none tracking-tighter mb-5"
                style={{ ...syne, fontSize: 'clamp(32px, 4vw, 52px)' }}
              >
                Recommendations<br />
                <span className="text-neutral-600">that actually work.</span>
              </h2>
              <p className="text-base text-neutral-500 font-light leading-relaxed mb-10 max-w-sm">
                Our engine analyses behaviour across the platform and surfaces content gaps your courses can fill — before your competitors do.
              </p>
              <a
                href="/register"
                className="inline-flex items-center gap-2 text-sm font-medium text-black bg-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity no-underline w-fit"
              >
                Try it free <ArrowRight size={15} />
              </a>
            </div>

            {/* Right — cards */}
            <div className="flex flex-col gap-3">
              {[
                { icon: Brain,      title: 'Demand Forecasting',   desc: 'AI predicts which topics will trend in your niche over the next 90 days.' },
                { icon: Star,       title: 'Content Gap Analysis', desc: "Identify what your students search for but can't find in your catalogue." },
                { icon: Users,      title: 'Personalised Paths',   desc: 'Each student gets a custom learning path built from their goals and history.' },
                { icon: TrendingUp, title: 'Revenue Optimisation', desc: 'Smart pricing suggestions based on demand, competition, and your audience.' },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0 mt-0.5">
                    <c.icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-200 mb-1">{c.title}</p>
                    <p className="text-sm text-neutral-500 leading-relaxed font-light">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-32 px-6 bg-white border-t border-gray-200 text-center">
          <h2
            className="font-black text-black leading-none tracking-tighter mb-5"
            style={{ ...syne, fontSize: 'clamp(40px, 7vw, 80px)' }}
          >
            Start teaching.<br />Start earning.
          </h2>
          <p className="text-lg text-gray-500 font-light mb-10 max-w-md mx-auto leading-relaxed">
            Join thousands of instructors already growing their income on CourseProMax.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap mb-4">
            <a href="/register" className="inline-flex items-center gap-2 text-sm font-medium text-white bg-black px-7 py-3.5 rounded-lg hover:opacity-80 transition-opacity no-underline">
              Create Free Account <ArrowRight size={15} />
            </a>
            <a href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-7 py-3.5 rounded-lg hover:border-gray-400 hover:text-black transition-all no-underline">
              Explore Dashboard
            </a>
          </div>
          <p className="text-xs text-gray-400">No credit card required · Free plan available</p>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-black text-neutral-600 px-8 md:px-12 pt-16 pb-8 border-t border-neutral-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-12 pb-12 border-b border-neutral-900 mb-8">
              <div className="max-w-xs shrink-0">
                <span style={syne} className="font-black text-white text-lg block mb-3 tracking-tight">
                  CourseProMax
                </span>
                <p className="text-sm leading-relaxed">
                  AI-powered course management for the modern instructor. Teach smarter, earn more.
                </p>
              </div>
              <div className="flex gap-12 md:gap-16 flex-wrap">
                {[
                  { heading: 'Product',     links: ['Features', 'Pricing', 'Security', 'API'] },
                  { heading: 'Instructors', links: ['Getting Started', 'Dashboard', 'Certifications', 'Payouts'] },
                  { heading: 'Company',     links: ['About', 'Blog', 'Careers', 'Contact'] },
                ].map(col => (
                  <div key={col.heading}>
                    <h5 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">{col.heading}</h5>
                    <ul className="flex flex-col gap-2.5 list-none">
                      {col.links.map(l => (
                        <li key={l}>
                          <a href="#" className="text-sm text-neutral-600 hover:text-white transition-colors no-underline">{l}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs">&copy; 2026 CourseProMax. All rights reserved.</p>
              <div className="flex gap-6">
                {['Privacy', 'Terms', 'Cookies'].map(l => (
                  <a key={l} href="#" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors no-underline">{l}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}