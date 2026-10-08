"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import AuthButtons from "@/components/auth/AuthButtons";

const categories = [
  { name: "চাল", slug: "chal", icon: "🍚" },
  { name: "ডাল", slug: "dal", icon: "🫘" },
  { name: "তেল", slug: "tel", icon: "🛢️" },
  { name: "সবজি", slug: "sobji", icon: "🥬" },
  { name: "মাছ", slug: "mach", icon: "🐟" },
  { name: "মাংস", slug: "mangsho", icon: "🍗" },
  { name: "ডিম-দুধ", slug: "dim-dui", icon: "🥚" },
  { name: "মসলা", slug: "mosla", icon: "🌶️" },
];

const tickerItems = [
  {
    name: "স্বর্ণমাছি চাল",
    price: "১৪৮",
    change: "▲ ২.৫%",
    up: true,
  },
  {
    name: "মিনিকেট চাল",
    price: "৯৯",
    change: "▼ ২.৯%",
    up: false,
  },
  {
    name: "বাটাম সাইড চাল",
    price: "৬৬",
    change: "▲ ০.৫%",
    up: true,
  },
  {
    name: "মসুর ডাল",
    price: "১৪২",
    change: "▲ ১.৯%",
    up: true,
  },
  {
    name: "ছোলা",
    price: "১২০",
    change: "▼ ২.৪%",
    up: false,
  },
  {
    name: "আমন চাল",
    price: "৯৫",
    change: "▲ ১.২%",
    up: true,
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Top Header */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-green-600">
            <img
              src="/assets/logo-icon.png"
              alt="বাজার দর"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              বাজার দর
            </h1>

            <p className="text-xs text-gray-500">
              বৃহস্পতিবার, ৮ অক্টোবর, ২০২৬
            </p>
          </div>
        </Link>

        {/* Authentication Buttons */}
        <AuthButtons />
      </div>

      {/* Category Navigation */}
      <div className="border-t border-gray-100">
        <nav className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2">
          {categories.map((category) => {
            const isActive =
              pathname === `/category/${category.slug}`;

            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <span className="text-base">
                  {category.icon}
                </span>

                <span>{category.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Price Ticker */}
      <div className="overflow-hidden border-t border-gray-200 bg-gray-50">
        <div className="flex min-w-max animate-[ticker_30s_linear_infinite]">
          {[...tickerItems, ...tickerItems].map(
            (item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 border-r border-gray-200 px-6 py-2 text-sm"
              >
                <span>🛒</span>

                <span className="font-medium text-gray-700">
                  {item.name}
                </span>

                <span className="text-gray-600">
                  {item.price} টাকা/কেজি
                </span>

                <span
                  className={
                    item.up
                      ? "font-semibold text-red-500"
                      : "font-semibold text-green-600"
                  }
                >
                  {item.change}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}