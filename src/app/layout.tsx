import type { Metadata,Viewport } from 'next';
import { Inter } from 'next/font/google'; // ← Add this import
import './globals.css';

// Load Inter as a variable font (best performance + flexibility)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Smart Bookmark App',
    template: '%s | Smart Bookmark App', // For child pages: "Bookmarks | Smart Bookmark App"
  },
  description: 'Manage, sync, and access your bookmarks instantly across devices.',
  keywords: ['bookmarks', 'bookmark manager', 'supabase', 'nextjs'],
  authors: [{ name: 'Manoj' }], // Optional personal touch
  // You can add more later: openGraph, twitter, icons, etc.
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' }, // light mode (e.g., slate-50)
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },  // dark mode (e.g., slate-950)
  ],
  // Optional extras if you want
  // colorScheme: 'light dark',
  // maximumScale: 1,          // disable zoom if desired
  // userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Optional: Add favicon, manifest, etc. later */}
      </head>
      <body
        className={`${inter.variable} antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}