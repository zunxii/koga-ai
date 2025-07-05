import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KOGA AI - Design with AI, Code with Confidence',
  description: 'Create beautiful UI designs using natural language. KOGA AI understands your vision and brings it to life in Figma, then generates production-ready code.',
  keywords: ['AI design', 'Figma', 'UI/UX', 'code generation', 'natural language', 'design automation'],
  authors: [{ name: 'KOGA AI Team' }],
  openGraph: {
    title: 'KOGA AI - Design with AI, Code with Confidence',
    description: 'Create beautiful UI designs using natural language. KOGA AI understands your vision and brings it to life in Figma, then generates production-ready code.',
    type: 'website',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#4285f4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="theme-color" content="#4285f4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}