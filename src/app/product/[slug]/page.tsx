import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { getProducts } from "@/lib/api";
import { getServerSession } from "@/lib/auth-server";
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

function calculatePercentage(current: number, previous: number) {
  if (previous === 0) {
    return 0;
  }

  return ((current - previous) / previous) * 100;
}

function getPriceChange(current: number, previous: number) {
  const difference = current - previous;

  const percentage = calculatePercentage(current, previous);

  if (difference > 0) {
    return {
      direction: "up" as const,
      percentage,
    };
  }

  if (difference < 0) {
    return {
      direction: "down" as const,
      percentage: Math.abs(percentage),
    };
  }

  return {
    direction: "flat" as const,
    percentage: 0,
  };
}

function PriceChangeBadge({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  const change = getPriceChange(current, previous);

  if (change.direction === "up") {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
        ▲ {toBanglaNumber(change.percentage.toFixed(1))}%
      </span>
    );
  }

  if (change.direction === "down") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
        ▼ {toBanglaNumber(change.percentage.toFixed(1))}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
      ● ০%
    </span>
  );
}

function getPriceColor(current: number, previous: number) {
  if (current > previous) {
    return "text-red-600";
  }

  if (current < previous) {
    return "text-green-600";
  }

  return "text-gray-700";
}

function ProductHeader({ product }: { product: Product }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
      <div className="grid gap-6 md:grid-cols-[150px_1fr_170px] md:items-center">
        {/* Product Image */}
        <div className="flex h-36 w-full items-center justify-center rounded-3xl bg-green-50 text-7xl md:h-40">
          {product.image || product.categoryIcon}
        </div>

        {/* Product Information */}
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
              {product.categoryIcon} {product.categoryNameBn}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700">
              প্রতি {getUnit(product.unit)}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
            {product.nameBn}
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-600 md:text-base">
            গড়পড়তা দামের তুলনায় আজ দাম{" "}
            <span
              className={
                product.change.dir === "up"
                  ? "font-bold text-red-600"
                  : product.change.dir === "down"
                    ? "font-bold text-green-600"
                    : "font-bold text-gray-700"
              }
            >
              {product.change.dir === "up"
                ? "বেড়েছে"
                : product.change.dir === "down"
                  ? "কমেছে"
                  : "অপরিবর্তিত"}
            </span>{" "}
            • {toBanglaNumber(product.yesterday)} টাকা
          </p>
        </div>

        {/* Today's Price */}
        <div className="rounded-2xl bg-green-50 p-5 text-center md:p-6">
          <p className="text-sm font-medium text-gray-500">
            আজকের দাম
          </p>

          <p className="mt-1 text-4xl font-extrabold text-green-700">
            ৳{toBanglaNumber(product.today)}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            টাকা / {getUnit(product.unit)}
          </p>

          <div className="mt-3">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                product.change.dir === "up"
                  ? "bg-red-50 text-red-600"
                  : product.change.dir === "down"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {product.change.dir === "up"
                ? "▲"
                : product.change.dir === "down"
                  ? "▼"
                  : "●"}{" "}
              {toBanglaNumber(product.change.pct)}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  /*
   * Next.js 16 request-time data fix
   */
  await connection();

  // Protected route
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  const { slug } = await params;

  const products = await getProducts();

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  /*
   * Dynamic market calculations
   */

  const minimumPrice =
    product.markets.length > 0
      ? Math.min(...product.markets.map((market) => market.min))
      : product.today;

  const maximumPrice =
    product.markets.length > 0
      ? Math.max(...product.markets.map((market) => market.max))
      : product.today;

  const marketAverages = product.markets.map(
    (market) => (market.min + market.max) / 2
  );

  const averagePrice =
    marketAverages.length > 0
      ? marketAverages.reduce(
          (total, price) => total + price,
          0
        ) / marketAverages.length
      : product.today;

  const roundedAveragePrice = Math.round(averagePrice);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center text-sm text-gray-500">
        <Link
          href="/"
          className="transition hover:text-green-600"
        >
          হোম
        </Link>

        <span className="mx-2">›</span>

        <Link
          href={`/category/${product.category}`}
          className="transition hover:text-green-600"
        >
          {product.categoryNameBn}
        </Link>

        <span className="mx-2">›</span>

        <span className="text-gray-800">
          {product.nameBn}
        </span>
      </div>

      {/* Product Header */}
      <ProductHeader product={product} />

      {/* Price Summary */}
      <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            দামের সারসংক্ষেপ
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Minimum */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              সর্বনিম্ন দাম
            </p>

            <p className="mt-2 text-3xl font-extrabold text-green-600">
              ৳{toBanglaNumber(minimumPrice)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              সবচেয়ে কম দামের বাজার
            </p>
          </div>

          {/* Maximum */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              সর্বোচ্চ দাম
            </p>

            <p className="mt-2 text-3xl font-extrabold text-red-600">
              ৳{toBanglaNumber(maximumPrice)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              সবচেয়ে বেশি দামের বাজার
            </p>
          </div>

          {/* Average */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              গড় দাম
            </p>

            <p className="mt-2 text-3xl font-extrabold text-blue-600">
              ৳{toBanglaNumber(roundedAveragePrice)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              প্রতি {getUnit(product.unit)}-এর হিসাবে
            </p>
          </div>
        </div>
      </section>

      {/* Historical Price */}
      <section className="mt-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            📅 আগের দামের তথ্য
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            আজকের দামের সাথে আগের সময়ের তুলনা।
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Yesterday */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-gray-500">
                গতকাল
              </p>

              <PriceChangeBadge
                current={product.today}
                previous={product.yesterday}
              />
            </div>

            <p
              className={`mt-3 text-2xl font-extrabold ${getPriceColor(
                product.today,
                product.yesterday
              )}`}
            >
              ৳{toBanglaNumber(product.yesterday)}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              গতকালের দাম
            </p>
          </div>

          {/* Last Week */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-gray-500">
                গত সপ্তাহ
              </p>

              <PriceChangeBadge
                current={product.today}
                previous={product.lastWeek}
              />
            </div>

            <p
              className={`mt-3 text-2xl font-extrabold ${getPriceColor(
                product.today,
                product.lastWeek
              )}`}
            >
              ৳{toBanglaNumber(product.lastWeek)}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              গত সপ্তাহের দাম
            </p>
          </div>

          {/* Last Month */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-gray-500">
                গত মাস
              </p>

              <PriceChangeBadge
                current={product.today}
                previous={product.lastMonth}
              />
            </div>

            <p
              className={`mt-3 text-2xl font-extrabold ${getPriceColor(
                product.today,
                product.lastMonth
              )}`}
            >
              ৳{toBanglaNumber(product.lastMonth)}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              গত মাসের দাম
            </p>
          </div>
        </div>
      </section>

      {/* Market Prices */}
      <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            বিভিন্ন বাজারের সর্বনিম্ন, সর্বোচ্চ ও গড় দাম।
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-sm font-bold text-gray-800">
                    বাজার
                  </th>

                  <th className="px-5 py-4 text-sm font-bold text-gray-800">
                    বিভাগ
                  </th>

                  <th className="px-5 py-4 text-sm font-bold text-green-700">
                    সর্বনিম্ন
                  </th>

                  <th className="px-5 py-4 text-sm font-bold text-red-600">
                    সর্বোচ্চ
                  </th>

                  <th className="px-5 py-4 text-sm font-bold text-gray-800">
                    গড়
                  </th>
                </tr>
              </thead>

              <tbody>
                {product.markets.map((market) => {
                  const marketAverage = Math.round(
                    (market.min + market.max) / 2
                  );

                  return (
                    <tr
                      key={`${market.market}-${market.division}`}
                      className="border-t border-gray-100 transition hover:bg-green-50/50"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                        {market.market}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {market.division}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-green-600">
                        ৳{toBanglaNumber(market.min)} টাকা
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-red-600">
                        ৳{toBanglaNumber(market.max)} টাকা
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-gray-700">
                        ৳{toBanglaNumber(marketAverage)} টাকা
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-green-700"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}

function ProductLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="animate-pulse">
        <div className="h-5 w-48 rounded bg-gray-200" />

        {/* Header skeleton */}
        <div className="mt-6 h-48 rounded-3xl bg-gray-200" />

        {/* Summary skeleton */}
        <div className="mt-8 h-8 w-56 rounded bg-gray-200" />

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-gray-200"
            />
          ))}
        </div>

        {/* Historical skeleton */}
        <div className="mt-8 h-8 w-56 rounded bg-gray-200" />

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-gray-200"
            />
          ))}
        </div>

        {/* Table skeleton */}
        <div className="mt-8 h-8 w-64 rounded bg-gray-200" />

        <div className="mt-5 h-72 rounded-2xl bg-gray-200" />
      </div>
    </main>
  );
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductContent params={params} />
    </Suspense>
  );
}