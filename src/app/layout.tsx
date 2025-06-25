
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import { PT_Sans } from 'next/font/google';
import { UserProvider } from '@/contexts/user-context';

const ptSans = PT_Sans({ 
  subsets: ['latin'], 
  variable: '--font-pt-sans',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MathMind',
  description: 'Turning Math into Magic! Engage in fun, adaptive math challenges designed to sharpen your memory and calculation skills.',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/icon-192x192.png',
  },
  themeColor: '#818cf8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ptSans.variable} font-body antialiased`}>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
