'use client'

import Link from 'next/link'
import { Briefcase, Users, TrendingUp, Award, Globe, Zap, Heart, Code, Lightbulb, Target, BookOpen } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

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

export default function Careers() {
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
              Build your career<br />
              <span className="text-gray-400">with purpose</span>
            </h1>
            <p className="anim-up text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              Join our team as an intern and help shape the future of online education. Gain real-world experience, 
              contribute to meaningful projects, and grow alongside a passionate team building tools for millions of educators worldwide.
            </p>
          </div>
        </section>

        {/* Why Intern At CourseProMax */}
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-4">
                Why Intern at CourseProMax?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-light">
                We invest in early-career talent. This is a real opportunity to learn, contribute, and grow.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Code,
                  title: 'Real Impact',
                  desc: 'Your code and ideas directly affect millions of educators. No busywork—only meaningful contributions.',
                },
                {
                  icon: Lightbulb,
                  title: 'Learn in Practice',
                  desc: 'Master modern technologies working on a production platform. Mentorship from experienced engineers.',
                },
                {
                  icon: Users,
                  title: 'Amazing Team',
                  desc: 'Work alongside passionate builders and educators who care deeply about the product and each other.',
                },
                {
                  icon: BookOpen,
                  title: 'Professional Development',
                  desc: 'Access to learning resources, tech talks, and mentorship. We invest in your growth.',
                },
                {
                  icon: Award,
                  title: 'Portfolio Builder',
                  desc: 'Build impressive projects for your portfolio. Get detailed recommendation letters at the end.',
                },
                {
                  icon: Globe,
                  title: 'Flexible Environment',
                  desc: 'Remote-friendly internship. Work at flexible hours while building experience on your own terms.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-400 transition-all hover:shadow-sm">
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

        {/* Benefits & Perks */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-4">
                What We Offer
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-light">
                Your experience and growth are valuable. We provide tangible benefits and opportunities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Structured Learning Path',
                  desc: 'Clear milestones and learning objectives. You\'ll know exactly what skills you\'re building and why it matters.',
                },
                {
                  icon: Heart,
                  title: 'Mentorship Program',
                  desc: 'Paired with experienced mentors who guide your growth. Regular check-ins and feedback on your work.',
                },
                {
                  icon: TrendingUp,
                  title: 'Career Advancement',
                  desc: 'Top-performing interns are fast-tracked for full-time roles. Proven entry path to our team.',
                },
                {
                  icon: Briefcase,
                  title: 'Professional Credentials',
                  desc: 'Completion certificates and strong recommendation letters. Boost your resume and LinkedIn profile.',
                },
                {
                  icon: Zap,
                  title: 'Tech Stack & Tools',
                  desc: 'Work with cutting-edge technologies. You\'ll gain hands-on experience with tools used at scale.',
                },
                {
                  icon: Award,
                  title: 'Networking Opportunities',
                  desc: 'Connect with industry professionals. Attend team events, workshops, and webinars.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:bg-white transition-colors">
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

        {/* Open Internship Roles */}
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-4">
                Open Internship Positions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto font-light">
                We're looking for passionate individuals in these areas. Don't see your fit? Contact us—we may have opportunities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Frontend Engineer Intern',
                  department: 'Engineering',
                  duration: '3-6 months',
                  description: 'Build interactive user interfaces using React, TypeScript, and Tailwind CSS. Work on real features affecting millions of users.',
                  requirements: ['React/TypeScript basics', 'HTML/CSS fundamentals', 'Passion for learning', 'Communication skills'],
                },
                {
                  title: 'Backend Engineer Intern',
                  department: 'Engineering',
                  duration: '3-6 months',
                  description: 'Develop scalable server-side solutions. Work with Node.js, databases, and APIs. Contribute to core platform infrastructure.',
                  requirements: ['Node.js or Python knowledge', 'Database fundamentals', 'REST API understanding', 'Problem-solving mindset'],
                },
                {
                  title: 'Product Design Intern',
                  department: 'Design',
                  duration: '3-6 months',
                  description: 'Design intuitive user experiences for the platform. Create wireframes, mockups, and design systems. Conduct user research.',
                  requirements: ['Design software (Figma/Adobe)', 'UI/UX fundamentals', 'Design thinking', 'Collaboration skills'],
                },
                {
                  title: 'Product Manager Intern',
                  department: 'Product',
                  duration: '3-6 months',
                  description: 'Work on feature prioritization, user research, and product strategy. Gather feedback from educators and stakeholders.',
                  requirements: ['Analytical thinking', 'Communication skills', 'User empathy', 'Attention to detail'],
                },
                {
                  title: 'Marketing & Growth Intern',
                  department: 'Marketing',
                  duration: '3-6 months',
                  description: 'Support campaigns, content creation, and community engagement. Help grow awareness among educators and creators.',
                  requirements: ['Writing and communication', 'Social media basics', 'Creativity', 'Marketing enthusiasm'],
                },
                {
                  title: 'Operations & Business Intern',
                  department: 'Operations',
                  duration: '3-6 months',
                  description: 'Support business operations, data analysis, and customer success. Help scale our processes and support systems.',
                  requirements: ['Attention to detail', 'Data analysis basics', 'Organization', 'Initiative-taking'],
                },
              ].map((role, i) => (
                <div key={i} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 style={syne} className="font-bold text-lg mb-1">
                        {role.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">{role.department} • {role.duration}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {role.description}
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">WHAT YOU'LL NEED:</p>
                    <div className="flex flex-wrap gap-2">
                      {role.requirements.map((req, j) => (
                        <span key={j} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-light">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Process */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-6">
                How to Apply
              </h2>
            </div>
            
            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Submit Your Application',
                  desc: 'Send us your resume, portfolio (if applicable), and a brief cover letter explaining your interest in the role and what you\'re hoping to learn.',
                },
                {
                  step: '02',
                  title: 'Initial Screening',
                  desc: 'We\'ll review your application and reach out if we\'d like to learn more. Most responses within 5-7 business days.',
                },
                {
                  step: '03',
                  title: 'Interview Process',
                  desc: 'A 30-minute conversation with our hiring team to understand your background, motivation, and technical fit (if applicable).',
                },
                {
                  step: '04',
                  title: 'Final Stage',
                  desc: 'A practical assignment or discussion to assess your capabilities. We keep this focused on real-world scenarios you\'ll face.',
                },
                {
                  step: '05',
                  title: 'Onboarding',
                  desc: 'If selected, you\'ll receive an offer letter, complete onboarding, and start your internship journey with mentorship from day one.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-black text-white flex items-center justify-center font-black text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 style={syne} className="font-bold text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: 'Is this a paid internship?',
                  a: 'This is an unpaid internship designed for individuals seeking to build experience and skills. However, we provide substantial value in the form of mentorship, professional development, recommendation letters, and opportunities for high performers to transition into paid roles.',
                },
                {
                  q: 'Do I need prior experience?',
                  a: 'Not necessarily! We welcome enthusiastic learners and individuals with foundational skills. What matters most is your willingness to learn, your communication, and your genuine interest in contributing to our mission.',
                },
                {
                  q: 'Is this remote or in-office?',
                  a: 'Our internship is remote-friendly. You can work from anywhere, so long as you maintain regular communication with your team and hit agreed-upon milestones.',
                },
                {
                  q: 'How long does the internship last?',
                  a: 'Internships typically last 3-6 months, depending on the role and your availability. We\'re flexible and can discuss what works best for your situation.',
                },
                {
                  q: 'What happens after the internship?',
                  a: 'High-performing interns are strongly considered for full-time positions. Even if that\'s not a fit, we\'ll provide strong recommendations, letters of reference, and ongoing networking opportunities.',
                },
                {
                  q: 'What\'s the time commitment?',
                  a: 'We typically expect 20-40 hours per week, depending on the role. This is flexible and can be adjusted based on your schedule and other commitments.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 style={syne} className="font-bold mb-2">
                    {item.q}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 md:px-12 bg-black text-white border-b border-neutral-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 style={{ ...syne, fontSize: 'clamp(36px, 5vw, 52px)' }} className="font-black tracking-tighter mb-6 leading-tight">
              Ready to make an impact?
            </h2>
            <p className="text-lg text-neutral-400 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              Submit your application and let's talk about how you can grow with us while building the future of online education.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact?subject=internship"
                className="bg-white text-black px-9 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity no-underline text-base"
              >
                Apply Now
              </Link>
              <Link
                href="/about"
                className="border-2 border-neutral-600 text-white px-9 py-4 rounded-lg font-medium hover:border-neutral-400 transition-colors no-underline text-base"
              >
                Learn More About Us
              </Link>
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
