'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Lightbulb } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const syne = { fontFamily: "'Syne', sans-serif" }
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

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
              Get in touch<br />
              <span className="text-gray-400">we'd love to hear from you</span>
            </h1>
            <p className="anim-up text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              Have questions, feedback, or partnership opportunities? We're here to help. Reach out through any channel below, 
              and we'll get back to you as quickly as we can.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-4">
                Ways to Reach Us
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Mail,
                  title: 'Email',
                  items: [
                    { label: 'General Inquiries', value: 'hello@remonode.com' },
                    { label: 'Sales & Partnerships', value: 'sales@remonode.com' },
                    { label: 'Support', value: 'support@remonode.com' },
                  ],
                },
                {
                  icon: MessageSquare,
                  title: 'Chat With Us',
                  items: [
                    { label: 'Live Chat', value: 'Available Mon-Fri, 9AM-5PM EST' },
                    { label: 'Response Time', value: 'Usually within 1-2 hours' },
                  ],
                },
                {
                  icon: Clock,
                  title: 'Response Time',
                  items: [
                    { label: 'Weekdays', value: 'Response within 24 hours' },
                    { label: 'Weekends', value: 'Response within 48 hours' },
                    { label: 'Urgent Matters', value: 'Contact support@remonode.com' },
                  ],
                },
                {
                  icon: Globe,
                  title: 'International',
                  items: [
                    { label: 'Timezone', value: 'EST (UTC-5), but we\'re global' },
                    { label: 'Language Support', value: 'English, and more upon request' },
                  ],
                },
                {
                  icon: Lightbulb,
                  title: 'Feature Requests',
                  items: [
                    { label: 'Have an idea?', value: 'Email features@remonode.com' },
                    { label: 'Feedback', value: 'We review every suggestion' },
                  ],
                },
                {
                  icon: Phone,
                  title: 'Partnerships',
                  items: [
                    { label: 'Business Inquiry', value: 'sales@remonode.com' },
                    { label: 'Integration Ideas', value: 'partners@remonode.com' },
                  ],
                },
              ].map((method, i) => (
                <div key={i} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-400 transition-all">
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-white mb-4">
                    <method.icon size={20} />
                  </div>
                  <h3 style={syne} className="font-bold mb-4">
                    {method.title}
                  </h3>
                  <div className="space-y-3">
                    {method.items.map((item, j) => (
                      <div key={j}>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-1">
                          {item.label}
                        </p>
                        {item.value.includes('@') ? (
                          <a href={`mailto:${item.value}`} className="text-sm font-medium text-black hover:text-gray-600 transition-colors no-underline">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-600 font-light">
                            {item.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16">
              <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-4">
                Send us a Message
              </h2>
              <p className="text-gray-600 font-light">
                Fill out the form below and we'll get back to you shortly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-green-600" />
                </div>
                <h3 style={syne} className="font-bold text-lg mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600 font-light">
                  Thank you for reaching out. We'll review your message and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors bg-white text-black placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="hello@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors bg-white text-black placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors bg-white text-black"
                  >
                    <option value="">Select a subject...</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales & Partnerships</option>
                    <option value="internship">Internship Application</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us what's on your mind..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none transition-colors bg-white text-black placeholder-gray-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </button>

                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. We'll never share your email without your permission.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h2 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black tracking-tighter mb-6">
              Didn't find what you need?
            </h2>
            <p className="text-lg text-gray-600 font-light mb-10">
              Check out our comprehensive help center or explore more about the platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/about"
                className="bg-black text-white px-8 py-3.5 rounded-lg font-medium hover:opacity-90 transition-opacity no-underline"
              >
                Learn About Us
              </Link>
              <Link
                href="/careers"
                className="border border-gray-300 text-black px-8 py-3.5 rounded-lg font-medium hover:border-gray-400 transition-colors no-underline"
              >
                View Careers
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
