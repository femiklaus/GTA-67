import type { Metadata, Viewport } from 'next';
import { Fredoka } from 'next/font/google';
import './globals.css';

// Fredoka: a rounded, friendly, slightly bouncy sans — used across the whole app.
const fredoka = Fredoka({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rounded',
});

export const metadata: Metadata = {
  title: 'GTA 67 - Miami Drive',
  description: 'A GTA VI-inspired driving experience',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // lets env(safe-area-inset-*) work on notched phones
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fredoka.variable}>
      <body>{children}</body>
    </html>
  );
}