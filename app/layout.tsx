import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"
/**
 * DESIGN.md — Font Family
 * The entire system runs on NotionInter (custom-tuned Inter).
 * Open-source substitute: Inter 400 / 500 / 600.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HIMAKOM — Himpunan Mahasiswa Komputer",
  description:
    "Website resmi Himpunan Mahasiswa Komputer. Temukan informasi kegiatan, program kerja, dan layanan rental produk HIMAKOM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
