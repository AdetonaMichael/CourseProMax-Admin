'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function TermsOfService() {
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
          line-height: 1.2;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #000;
        }

        .legal-section h3 {
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 1.125rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
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

        .legal-section a {
          color: #000;
          text-decoration: underline;
        }

        .legal-section a:hover {
          opacity: 0.7;
        }
      `}</style>

      <div className="min-h-screen bg-white text-black overflow-x-hidden">
        {/* Fixed Nav */}
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

        {/* Header */}
        <section className="pt-32 pb-16 px-6 md:px-12 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h1 style={{ ...syne, fontSize: 'clamp(32px, 5vw, 48px)' }} className="font-black text-black leading-none tracking-tighter mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600">Last updated: March 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <div className="max-w-4xl mx-auto legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using CourseProMax (the "Service"), operated by Remonode ("Company," "we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, you may not use our Service. We reserve the right to update these terms at any time, and your continued use constitutes acceptance of those updates.
            </p>

            <h2>2. Use of Service</h2>
            <h3>2.1 License Grant</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for lawful purposes only. This license does not permit you to:
            </p>
            <ul>
              <li>Sublicense, resell, or commercially exploit the Service</li>
              <li>Reverse engineer, decompile, or create derivative works</li>
              <li>Remove proprietary notices or labels</li>
              <li>Circumvent security measures or access controls</li>
              <li>Use the Service to develop competing products</li>
            </ul>

            <h3>2.2 Acceptable Use</h3>
            <p>
              You agree not to use the Service to:
            </p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights of third parties</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Engage in harassment, threats, or hate speech</li>
              <li>Post copyrighted or proprietary content without permission</li>
              <li>Spoof identity or misrepresent affiliation</li>
              <li>Excessive pinging, scanning, or denial-of-service attacks</li>
              <li>Collect or track personally identifiable information without consent</li>
            </ul>

            <h2>3. User Responsibilities</h2>
            <h3>3.1 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and are liable for all activities conducted under your account. You agree to:
            </p>
            <ul>
              <li>Use a strong, unique password and enable two-factor authentication when available</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Log out after each session on shared devices</li>
              <li>Not share credentials with others</li>
            </ul>

            <h3>3.2 Content Responsibility</h3>
            <p>
              You are solely responsible for course content, materials, and data you upload. You warrant that:
            </p>
            <ul>
              <li>You own or have rights to all content you provide</li>
              <li>Content does not infringe on third-party rights</li>
              <li>Content is accurate, legal, and non-harmful</li>
              <li>You will not upload illegal or inappropriate material</li>
            </ul>

            <h2>4. Account Terms</h2>
            <h3>4.1 Eligibility</h3>
            <p>
              You must be at least 18 years old and a resident of a jurisdiction where our Service is lawfully available. If using the Service on behalf of an organization, you represent that you have authority to bind that organization.
            </p>

            <h3>4.2 Account Termination</h3>
            <p>
              We may suspend or terminate your account if you:
            </p>
            <ul>
              <li>Violate these Terms of Service</li>
              <li>Engage in fraudulent or illegal activity</li>
              <li>Repeatedly violate acceptable use policies</li>
              <li>Fail to pay invoices</li>
            </ul>
            <p>
              Account termination does not relieve you of payment obligations for services already provided.
            </p>

            <h2>5. Intellectual Property</h2>
            <h3>5.1 Company IP</h3>
            <p>
              The Service, including all software, design, text, graphics, and content, is the proprietary property of Remonode and protected by copyright, trademark, and other intellectual property laws. We grant you a non-exclusive, non-transferable license to use the Service as permitted by these terms.
            </p>

            <h3>5.2 Your Content</h3>
            <p>
              You retain all rights to content you create and upload. By uploading content, you grant us a license to store, display, and transmit it for service delivery. You grant students enrolled in your courses a personal, non-transferable license to access the content.
            </p>

            <h3>5.3 Feedback</h3>
            <p>
              Any feedback or suggestions you provide become our property and may be used without compensation or obligation to you.
            </p>

            <h2>6. Payment & Billing</h2>
            <h3>6.1 Pricing & Payment</h3>
            <p>
              Subscription pricing is displayed in our pricing page. Payments are processed monthly or annually based on your subscription plan. We accept major credit cards, PayPal, and other payment methods.
            </p>

            <h3>6.2 Billing Disputes</h3>
            <p>
              You must notify us of billing disputes within 30 days. Refunds are available within 14 days of purchase for unused services.
            </p>

            <h3>6.3 Taxes</h3>
            <p>
              You are responsible for all applicable taxes on your account. If we are legally required to collect VAT or sales tax, it will be added to your invoice.
            </p>

            <h2>7. Limitation of Liability</h2>
            <h3>7.1 Disclaimer</h3>
            <p>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>

            <h3>7.2 Limitation of Damages</h3>
            <p>
              IN NO EVENT SHALL REMONODE BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS OR DATA, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>

            <h3>7.3 Liability Cap</h3>
            <p>
              OUR TOTAL LIABILITY TO YOU SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PRECEDING 12 MONTHS (OR $100 IF YOU HAVE NOT PAID).
            </p>

            <h2>8. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Remonode from claims, damages, and costs arising from:
            </p>
            <ul>
              <li>Your violation of these Terms</li>
              <li>Your use of the Service</li>
              <li>Your content or data</li>
              <li>Your intellectual property infringement</li>
            </ul>

            <h2>9. Termination</h2>
            <h3>9.1 User Termination</h3>
            <p>
              You may terminate your account at any time by contacting support. Account termination does not refund prepaid fees.
            </p>

            <h3>9.2 Company Termination</h3>
            <p>
              We may terminate your access immediately for cause or with 30 days' notice for convenience. Upon termination, you may request export of your data.
            </p>

            <h2>10. Governing Law & Dispute Resolution</h2>
            <h3>10.1 Governing Law</h3>
            <p>
              These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to conflicts of law principles.
            </p>

            <h3>10.2 Arbitration</h3>
            <p>
              Any dispute arising from these Terms shall be resolved via binding arbitration administered by [Arbitration Organization]. Arbitration shall take place in [Location] and be conducted in English.
            </p>

            <h3>10.3 Exceptions</h3>
            <p>
              This arbitration clause does not apply to claims for injunctive relief, intellectual property infringement, or small claims court proceedings.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. Significant changes will be communicated via email or prominent notice on the Service. Your continued use constitutes acceptance of modified terms. If you object to changes, your sole recourse is to cease using the Service.
            </p>

            <h2>12. Severability</h2>
            <p>
              If any provision of these Terms is found invalid or unenforceable, that provision shall be modified to the minimum extent necessary, and all other provisions shall remain in full effect.
            </p>

            <h2>13. Contact</h2>
            <p>
              For questions about these Terms, contact us at legal@remonode.com or through our support portal. Remonode is the operator of CourseProMax and takes full responsibility for all services provided herein.
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
