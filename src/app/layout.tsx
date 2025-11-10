import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/lib/i18n";
import FloatingChat from "@/components/floating-chat";
import CookieConsent from "@/components/CookieConsent";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "7 Connect - Platform Chatbot AI Indonesia",
  description: "Platform chatbot AI terdepan di Indonesia untuk layanan pelanggan, engagement, dan otomasi bisnis. Dilengkapi dengan RAG system dan multi-channel integration.",
  keywords: ["7 Connect", "Chatbot AI", "AI Indonesia", "Layanan Pelanggan", "Otomasi Bisnis", "RAG System", "WhatsApp Integration", "Multi-channel"],
  authors: [{ name: "7 Connect Team" }],
  openGraph: {
    title: "7 Connect - Platform Chatbot AI Indonesia",
    description: "Platform chatbot AI terdepan untuk solusi bisnis digital Anda",
    url: "https://7connect.id",
    siteName: "7 Connect",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "7 Connect - Platform Chatbot AI Indonesia",
    description: "Platform chatbot AI terdepan untuk solusi bisnis digital Anda",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  other: {
    'color-scheme': 'light dark',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <LanguageProvider>
          <I18nProvider>
            {children}
            <FloatingChat />
            <CookieConsent />
            <Toaster />
          </I18nProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
