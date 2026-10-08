import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "বাজার দর | বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর এক নজরে দেখুন।",
};

function HeaderLoading() {
  return (
    <div className="h-[135px] w-full animate-pulse bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="h-11 w-40 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-[#f4f8f3] text-gray-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Suspense fallback={<HeaderLoading />}>
            <Header />
          </Suspense>

          <main className="flex-1">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
  
}