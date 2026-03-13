import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastContainer } from "@/components/shared/Toast";
import { AlertContainer } from "@/components/shared/AlertContainer";
import { ConfirmationDialogProvider } from "@/components/shared/ConfirmationDialog";
import { PromptDialogProvider } from "@/components/shared/PromptDialog";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SessionErrorBoundary } from "@/components/auth/SessionErrorBoundary";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "CourseProMax - The Future of Course Management",
  description: "Enterprise-grade course management platform. Secure, elegant, powerful. The epitome of educational platform excellence.",
  keywords: ["course management", "LMS", "learning management system", "education platform", "online courses", "course hosting"],
  authors: [{ name: "CourseProMax Team" }],
  creator: "Remonode",
  publisher: "Remonode",
  icons: {
    icon: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coursepromax.com",
    title: "CourseProMax - The Future of Course Management",
    description: "Enterprise-grade course management platform. Secure, elegant, powerful. The epitome of educational platform excellence.",
    siteName: "CourseProMax",
    images: [
      {
        url: "https://coursepromax.com/og-image-1200x630.png",
        width: 1200,
        height: 630,
        alt: "CourseProMax - Course Management Platform",
        type: "image/png",
      },
      {
        url: "https://coursepromax.com/og-image-800x600.png",
        width: 800,
        height: 600,
        alt: "CourseProMax - Enterprise Learning Solution",
        type: "image/png",
      },
      {
        url: "https://coursepromax.com/og-image-square.png",
        width: 512,
        height: 512,
        alt: "CourseProMax Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CourseProMax - The Future of Course Management",
    description: "Enterprise-grade course management platform. Secure, elegant, powerful. The epitome of educational platform excellence.",
    images: ["https://coursepromax.com/og-image-1200x630.png"],
    creator: "@coursepromax",
    site: "@coursepromax",
  },
  alternates: {
    canonical: "https://coursepromax.com",
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ConfirmationDialogProvider>
          <PromptDialogProvider>
            <AuthProvider>
              <SessionErrorBoundary>
                {children}
              </SessionErrorBoundary>
            </AuthProvider>
            <ToastContainer />
            <AlertContainer />
          </PromptDialogProvider>
        </ConfirmationDialogProvider>
      </body>
    </html>
  );
}
