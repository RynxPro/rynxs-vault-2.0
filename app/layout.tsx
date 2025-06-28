import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rynx's Vault - Share Your Games, Inspire the Community",
    template: "%s | Rynx's Vault"
  },
  description: "Create your dev page, post updates, and turn ideas into full-blown games with support from others. Join the community of game developers and share your creations.",
  keywords: ["game development", "indie games", "game community", "game sharing", "developer platform"],
  authors: [{ name: "Rynx's Vault Team" }],
  creator: "Rynx's Vault",
  publisher: "Rynx's Vault",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Rynx's Vault - Share Your Games, Inspire the Community",
    description: "Create your dev page, post updates, and turn ideas into full-blown games with support from others.",
    siteName: "Rynx's Vault",
    images: [
      {
        url: "/logo.png",
        width: 150,
        height: 30,
        alt: "Rynx's Vault Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rynx's Vault - Share Your Games, Inspire the Community",
    description: "Create your dev page, post updates, and turn ideas into full-blown games with support from others.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  themeColor: "#9ec6f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <SanityLive />
        <Navbar />
        <main role="main">
          {children}
        </main>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--background)',
              color: 'var(--foreground)',
            },
          }}
        />
      </body>
    </html>
  );
}
