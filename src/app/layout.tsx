// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Mengatur font Inter untuk seluruh aplikasi
const inter = Inter({ subsets: ["latin"] });

// Metadata untuk SEO dan informasi tab browser
export const metadata: Metadata = {
  title: "Gemahripah Operations",
  description: "Sistem Operasional Bisnis Minuman Gemahripah",
};

// Root Layout: Komponen ini membungkus semua halaman
// 'children' adalah halaman yang sedang aktif (misal: /products, /resellers)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Tag body menerapkan font Inter dan style global */}
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {/* Header akan muncul di semua halaman */}
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-g-green">Gemahripah Ops</h1>
              <span className="text-sm text-muted-foreground">Selamat datang, Admin!</span>
            </div>
          </header>
          
          {/* Konten dinamis dari setiap halaman akan dirender di sini */}
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
