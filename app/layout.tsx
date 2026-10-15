import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Mark Gonzalez | Software Developer',
  description: 'Software developer from Dallas, Texas. Explore production development, mobile applications, and technical teaching.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
