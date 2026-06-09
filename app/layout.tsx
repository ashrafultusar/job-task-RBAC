import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RBAC Platform | Secure Role-Based Access Control",
    template: "%s | RBAC Platform",
  },
  description:
    "A secure, modern full-stack Role-Based Access Control (RBAC) web application built with Next.js 15, NextAuth.js, and MongoDB.",
  keywords: [
    "RBAC",
    "Next.js 15",
    "Role Based Access Control",
    "Authentication",
    "NextAuth",
    "Cybersecurity",
    "MERN Stack",
  ],
  authors: [{ name: "Ashraful Islam Tusar" }],
  creator: "Ashraful Islam Tusar",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),

  openGraph: {
    title: "RBAC Platform | Secure Role-Based Access Control",
    description:
      "Manage users, roles, and system permissions securely with real-time session tracking and NextAuth validation.",
    url: "/",
    siteName: "RBAC Platform",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RBAC Platform Preview",
      },
    ],
  },
};

import Navbar from "@/components/Navbar";
import { Providers } from "@/Providers/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
