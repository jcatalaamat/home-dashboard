import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppProvider } from '@/context/AppContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: 'Astral OS',
  description: 'Personal dashboard for life management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <AppProvider>{children}</AppProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
