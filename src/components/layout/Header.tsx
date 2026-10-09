
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import AuthButtons from "@/components/auth/AuthButtons";
import CurrentDate from "@/components/home/CurrentDate";
import type { Product } from "@/types/product";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.api-store.workers.dev/api/bazardor";

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

function toBanglaNumber(value: number | string) {
  return String(value).replace(
    /\d/g,
    (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]
  );
}

function getUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    liter: "লিটার",
    piece: "টি",
    dozen: "ডজন",
  };

  return units[unit] || unit;
}

export default function Header() {
  const pathname = usePathname();
  const [tickerProducts, setTickerProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadTickerProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি");
        }

        const data: Product[] = await response.json();

        if (!cancelled) {
          setTickerProducts(data);
        }
      } catch (error) {
        console.error("Price ticker loading error:", error);
      }
    }

    loadTickerProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const tickerItems = [...tickerProducts, ...tickerProducts];

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Top Header: Logo, Date and Authentication */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-600">
            <img
              src="/assets/logo-icon.png"
              alt="বাজার দর"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900">
              বাজার দর
            </h1>

            <p className="min-h-[20px] text-xs text-gray-500">
              <CurrentDate />
            </p>
          </div>
        </Link>

        <AuthButtons />
      </div>

      {/* Category Navigation */}
      <div className="border-t border-gray-100">
        <nav
          aria-label="পণ্যের ক্যাটাগরি"
          className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2"
        >
          {categories.map((category) => {
            const isActive =
              pathname === `/category/${category.slug}`;

            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                aria-current={isActive ? "page" : undefined}
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

      {/* Dynamic Price Ticker */}
      <div className="overflow-hidden border-t border-gray-200 bg-gray-50">
        {tickerProducts.length > 0 ? (
          <div className="price-ticker-track flex w-max">
            {tickerItems.map((product, index) => {
              const isUp = product.change.dir === "up";
              const isDown = product.change.dir === "down";

              return (
                <Link
                  key={`${product.id}-${index}`}
                  href={`/product/${product.slug}`}
                  title={`${product.nameBn} - বিস্তারিত দেখুন`}
                  className="flex shrink-0 items-center gap-2 border-r border-gray-200 px-6 py-2 text-sm transition hover:bg-green-50"
                >
                  <span>🛒</span>

                  <span className="font-medium text-gray-700">
                    {product.nameBn}
                  </span>

                  <span className="text-gray-600">
                    {toBanglaNumber(product.today)} টাকা/
                    {getUnit(product.unit)}
                  </span>

                  <span
                    className={
                      isUp
                        ? "font-semibold text-red-500"
                        : isDown
                          ? "font-semibold text-green-600"
                          : "font-semibold text-gray-500"
                    }
                  >
                    {isUp ? "▲" : isDown ? "▼" : "●"}{" "}
                    {toBanglaNumber(product.change.pct)}%
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-2 text-sm text-gray-500">
            বাজারদরের তথ্য লোড হচ্ছে...
          </div>
        )}
      </div>
    </header>
  );
}
