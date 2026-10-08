import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";

import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product";

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

function ProductCard({ product }: { product: Product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl">
          {product.image || product.categoryIcon}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            isUp
              ? "bg-red-50 text-red-600"
              : isDown
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {isUp ? "▲" : isDown ? "▼" : "●"}{" "}
          {toBanglaNumber(product.change.pct)}%
        </span>
      </div>

      <p className="mb-1 text-sm text-gray-500">
        {product.categoryIcon} {product.categoryNameBn}
      </p>

      <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-green-700">
        {product.nameBn}
      </h3>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-500">আজকের দাম</p>

          <p className="text-2xl font-bold text-gray-900">
            ৳{toBanglaNumber(product.today)}
          </p>
        </div>

        <p className="text-sm text-gray-500">
          / {getUnit(product.unit)}
        </p>
      </div>
    </Link>
  );
}

function PriceSection({
  title,
  products,
  icon,
}: {
  title: string;
  products: Product[];
  icon: string;
}) {
  return (
    <section className="mb-14">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {icon} {title}
          </h2>

          <div className="mt-2 h-1 w-16 rounded-full bg-green-600" />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          কোনো পণ্য পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

async function HomeContent() {
  // Next.js 16 Cache Components:
  // এই page-এ API request-এর জন্য request-time rendering প্রয়োজন।
  await connection();

  const products = await getProducts();

  const risers = [...products]
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="grid items-center gap-8 px-6 py-10 md:grid-cols-2 md:px-10 lg:px-12">
            <div>
              <span className="inline-flex rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                আজকের বাজারদর
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                আজকের বাজারের দাম এক নজরে
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
                চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
                বাজারভিত্তিক বিস্তারিত তথ্য, গড়, সর্বনিম্ন এবং সর্বোচ্চ
                দামের পরিবর্তন এক জায়গায়।
              </p>

              <a
                href="#সব-পণ্য"
                className="mt-7 inline-flex rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-green-700"
              >
                সব পণ্য দেখুন
              </a>
            </div>

            <div className="relative flex justify-center">
              <Image
                src="/assets/bazar-hero.png"
                alt="বাজারের পণ্য"
                width={560}
                height={420}
                priority
                className="h-auto w-full max-w-md object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pb-16">
        {/* Top Risers */}
        <PriceSection
          title="আজ সবচেয়ে বেশি বেড়েছে"
          icon="📈"
          products={risers}
        />

        {/* Top Fallers */}
        <PriceSection
          title="আজ সবচেয়ে বেশি কমেছে"
          icon="📉"
          products={fallers}
        />

        {/* All Products */}
        <section
          id="সব-পণ্য"
          className="scroll-mt-32"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              🛒 সব পণ্য
            </h2>

            <div className="mt-2 h-1 w-16 rounded-full bg-green-600" />

            <p className="mt-3 text-gray-600">
              বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর।
            </p>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              কোনো পণ্য পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function HomeLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="animate-pulse">
        {/* Hero Skeleton */}
        <div className="h-80 rounded-3xl bg-gray-200" />

        {/* Heading Skeleton */}
        <div className="mt-12 h-8 w-64 rounded bg-gray-200" />

        {/* Product Skeleton */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-64 rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}