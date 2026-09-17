import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sol-loom.gx816.chatgpt.site'),
  title: { default: 'Sol Loom — The solar system, alive', template: '%s · Sol Loom' },
  description: 'Explore a time-aware, interactive model of the solar system.',
  applicationName: 'Sol Loom',
  keywords: ['solar system', 'astronomy', '3D planets', 'orbital model'],
  openGraph: {
    type: 'website',
    title: 'Sol Loom — The solar system, alive',
    description: 'Explore the worlds orbiting our star — across distance, scale, and time.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Sol Loom — The solar system, alive in your browser.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sol Loom — The solar system, alive',
    description: 'Explore the worlds orbiting our star — across distance, scale, and time.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
