import type { Metadata, Viewport } from 'next';
import { Fredoka_One } from 'next/font/google';

const fredokaOne = Fredoka_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GTA 67',
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
    <html lang="en" className={fredokaOne.className}>
      <body>{children}</body>
    </html>
  );
}