'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = session.user.roles?.[0] || 'user'
      switch (role) {
        case 'admin':      router.replace('/admin');      break
        case 'instructor': router.replace('/instructor'); break
        default:           router.replace('/dashboard')
      }
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
          <p className="text-sm text-gray-400 tracking-widest uppercase">Loading</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
          body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .anim-fade-up   { animation: fadeUp 0.5s ease both; }
          .anim-delay-1   { animation-delay: 0.05s; }
          .anim-delay-2   { animation-delay: 0.10s; }
          .anim-delay-3   { animation-delay: 0.15s; }
          .anim-delay-4   { animation-delay: 0.20s; }
          .anim-delay-5   { animation-delay: 0.25s; }

          .login-grid {
            background-image:
              linear-gradient(#ebebeb 1px, transparent 1px),
              linear-gradient(90deg, #ebebeb 1px, transparent 1px);
            background-size: 48px 48px;
            -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%);
            mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%);
          }

          .input-field {
            width: 100%;
            padding: 10px 14px;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            color: #0a0a0a;
            background: #fafafa;
            border: 1px solid #e4e4e4;
            border-radius: 8px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .input-field::placeholder { color: #bbb; }
          .input-field:focus {
            border-color: #0a0a0a;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
          }
          .input-field.input-error {
            border-color: #e44;
            box-shadow: 0 0 0 3px rgba(220,50,50,0.08);
          }
        `}</style>

        <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
          {/* Grid background */}
          <div className="login-grid absolute inset-0 opacity-60 pointer-events-none" />

          {/* Card */}
          <div className="relative z-10 w-full max-w-sm">
            {/* Logo */}
            <div className="anim-fade-up text-center mb-8">
              <a
                href="/"
                style={{ fontFamily: "'Syne', sans-serif" }}
                className="font-black text-xl tracking-tight text-black no-underline"
              >
                CourseProMax
              </a>
            </div>

            {/* Form card */}
            <div className="anim-fade-up anim-delay-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <LoginForm />
            </div>

            {/* Footer note */}
            <p className="anim-fade-up anim-delay-5 text-center text-xs text-gray-400 mt-6">
              By signing in you agree to our{' '}
              <a href="/terms" className="underline hover:text-black transition-colors">Terms</a>
              {' '}and{' '}
              <a href="/privacy" className="underline hover:text-black transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>
      </>
    )
  }

  return null
}