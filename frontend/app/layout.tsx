import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LayoutProvider } from './components/layout/LayoutProvider';
import { Providers } from './components/wallet/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Stackremit - Cross border payments made easy',
  description: 'Join the future of cross-border payments with Stackremit.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <LayoutProvider>{children}</LayoutProvider>
        </Providers>
      </body>
    </html>
  );
}
