import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Ragdoll Breeder Tools",
  description: "Genetics calculator and reference guides for Ragdoll cat breeders",
};

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
      <body className="min-h-full flex flex-col bg-gray-50">
        {/* Navigation Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🐱</span>
              </div>
              <Link href="/" className="text-xl font-bold text-gray-900">
                Ragdoll Breeder Tools
              </Link>
            </div>
            <div className="hidden md:flex gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Home
              </Link>
              <Link
                href="/reference"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Reference
              </Link>
              <Link
                href="/genetics"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Calculator
              </Link>
              <Link
                href="/litter-planner"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Litter Planner
              </Link>
            </div>
          </nav>
        </header>

        {/* Page content */}
        <div className="flex-1 flex flex-col">{children}</div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 py-8 text-center text-gray-600 text-sm">
            <p>
              Ragdoll Breeder Tools • Genetics engine for responsible breeding •{" "}
              <span>© 2024</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
