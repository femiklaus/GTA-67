import type { Metadata, Viewport } from 'next';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}