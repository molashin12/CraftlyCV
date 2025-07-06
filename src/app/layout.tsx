import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

// ============================================================================
// FONT CONFIGURATION
// ============================================================================

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: {
    default: 'CraftlyCV - AI-Powered Resume & Cover Letter Generator',
    template: '%s | CraftlyCV'
  },
  description: 'Create tailored resumes and cover letters from a single profile using AI. Optimize for ATS, track applications, and land your dream job with CraftlyCV.',
  keywords: [
    'resume builder',
    'cover letter generator',
    'AI resume',
    'ATS optimization',
    'job application',
    'career tools',
    'professional resume',
    'job search'
  ],
  authors: [{ name: 'CraftlyCV Team' }],
  creator: 'CraftlyCV',
  publisher: 'CraftlyCV',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CraftlyCV - AI-Powered Resume & Cover Letter Generator',
    description: 'Create tailored resumes and cover letters from a single profile using AI. Optimize for ATS and land your dream job.',
    siteName: 'CraftlyCV',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CraftlyCV - AI-Powered Resume Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CraftlyCV - AI-Powered Resume & Cover Letter Generator',
    description: 'Create tailored resumes and cover letters from a single profile using AI.',
    images: ['/og-image.png'],
    creator: '@craftlycv',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

// ============================================================================
// VIEWPORT CONFIGURATION
// ============================================================================

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1C2B39' },
    { media: '(prefers-color-scheme: dark)', color: '#1C2B39' },
  ],
};

// ============================================================================
// ROOT LAYOUT COMPONENT
// ============================================================================

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Analytics - Google Analytics */}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body 
        className="min-h-screen bg-soft-bg text-dark-text antialiased"
        suppressHydrationWarning
      >
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-navy text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
        
        {/* Main App Wrapper */}
        <div id="app-root" className="relative">
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToastProvider>
        </div>
        
        {/* Portal for modals and overlays */}
        <div id="modal-root" />
        <div id="tooltip-root" />
        
        {/* Loading indicator for page transitions */}
        <div 
          id="page-loading" 
          className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-pen-blue to-primary-navy transform scale-x-0 origin-left transition-transform duration-300 z-50"
          style={{ display: 'none' }}
        />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}