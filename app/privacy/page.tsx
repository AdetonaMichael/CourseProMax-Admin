'use client'

import Link from 'next/link'

export default function PrivacyPolicy() {
  const syne = { fontFamily: "'Syne', sans-serif" }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap');

        body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

        .legal-section h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.5rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .legal-section h3 {
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 1.125rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .legal-section p {
          color: #6b7280;
          line-height: 1.75;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .legal-section ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          color: #6b7280;
        }

        .legal-section li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
          font-size: 0.95rem;
        }
      `}</style>

      <div className="min-h-screen bg-white text-black">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <Link href="/" style={syne} className="font-black text-lg tracking-tight">
            CourseProMax
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-black">
            Back to Home
          </Link>
        </nav>

        {/* Header */}
        <section className="pt-32 pb-16 px-6 md:px-12 border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h1 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600">Last updated: March 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-4xl mx-auto legal-section">

            <h2>Introduction</h2>
            <p>
              CourseProMax is a product of Remonode. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.
            </p>

            <h2>1. Information We Collect</h2>

            <h3>1.1 Information You Provide</h3>
            <ul>
              <li>Account details (name, email, password)</li>
              <li>Billing and payment-related information (processed by third parties)</li>
              <li>Course content and uploaded materials</li>
              <li>Messages, support requests, and feedback</li>
            </ul>

            <h3>1.2 Information Collected Automatically</h3>
            <ul>
              <li>Device and browser information</li>
              <li>Usage data (pages visited, interactions)</li>
              <li>Cookies and session data</li>
              <li>Approximate location based on IP</li>
            </ul>

            <h2>2. How We Use Information</h2>
            <ul>
              <li>To provide and maintain the platform</li>
              <li>To manage user accounts</li>
              <li>To process transactions</li>
              <li>To improve product performance and usability</li>
              <li>To communicate with users (support and updates)</li>
              <li>To detect abuse, fraud, or misuse</li>
            </ul>

            <h2>3. Data Sharing</h2>
            <p>
              We may share limited information with service providers that help us operate the platform, such as:
            </p>
            <ul>
              <li>Payment processors</li>
              <li>Hosting and infrastructure providers</li>
              <li>Analytics tools</li>
              <li>Email and communication services</li>
            </ul>
            <p>
              We may also disclose information if required by law or to protect our rights.
            </p>

            <h2>4. Data Retention</h2>
            <p>
              We retain information for as long as necessary to operate the platform, comply with legal obligations, and resolve disputes.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We take reasonable measures to protect your information from unauthorized access, loss, or misuse. However, no system is completely secure.
            </p>

            <h2>6. Your Choices</h2>
            <ul>
              <li>You can update your account information at any time</li>
              <li>You can opt out of non-essential communications</li>
              <li>You may request account deletion where applicable</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>
              We use cookies to maintain sessions and improve user experience. You can control cookies through your browser settings.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Continued use of the platform indicates acceptance of the updated policy.
            </p>

            <h2>9. Contact</h2>
            <p>
              For any questions regarding this policy, contact:
            </p>
            <ul>
              <li>Email: privacy@remonode.com</li>
            </ul>

          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-neutral-600 px-8 md:px-12 py-12 border-t border-neutral-900">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pb-6 border-b border-neutral-900">
              <p className="text-xs">&copy; 2026 CourseProMax</p>
              <div className="flex gap-6">
                <a href="/privacy" className="text-xs hover:text-neutral-400">Privacy</a>
                <a href="/terms" className="text-xs hover:text-neutral-400">Terms</a>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <p className="text-xs text-neutral-700">
                Powered by <span className="text-neutral-500 font-semibold">Remonode</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}