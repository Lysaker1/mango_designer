import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CookieBanner from '@/components/CookieBanner';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Mango Designer",
  description: "3D Configurator for Mango Designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
