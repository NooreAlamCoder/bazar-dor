import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 🔐 Protected route
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

  const prices = product.markets.flatMap((market) => [
    market.min,
    market.max,
  ]);

  const minimumPrice = prices.length
    ? Math.min(...prices)
    : product.today;

  const maximumPrice = prices.length
    ? Math.max(...prices)
    : product.today;

  const averagePrice =
    prices.length > 0
      ? prices.reduce((total, price) => total + price, 0) /
        prices.length
      : product.today;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-green-600">
          হোম
        </Link>

        <span className="mx-2">/</span>

        <span>{product.categoryNameBn}</span>

        <span className="mx-2">/</span>

        <span className="text-gray-800">
          {product.nameBn}
        </span>
      </div>

      {/* Product Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
          {/* Product Icon */}
          <div className="flex h-48 items-center justify-center rounded-3xl bg-green-50 text-8xl">
            {product.image || product.categoryIcon}
          </div>

          {/* Product Information */}
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                {product.categoryIcon} {product.categoryNameBn}
              </span>

              <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                প্রতি {getUnit(product.unit)}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 md:text-5xl">
              {product.nameBn}
            </h1>

            <p className="mt-4 leading-8 text-gray-600">
              {product.nameBn} এর আজকের বাজারদর এবং বিভিন্ন
              বাজারের সর্বনিম্ন ও সর্বোচ্চ দামের তথ্য এখানে
              এক নজরে দেখা যাবে।
            </p>

            <div className="mt-6 flex flex-wrap items-end gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  আজকের দাম
                </p>

                <p className="text-4xl font-extrabold text-green-700">
                  ৳{toBanglaNumber(product.today)}
                </p>
              </div>

              <span
                className={`mb-1 rounded-full px-4 py-2 text-sm font-bold ${
                  product.change.dir === "up"
                    ? "bg-red-50 text-red-600"
                    : product.change.dir === "down"
                      ? "bg-green-50 text-green-600"
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

      {/* Price Summary */}
      <section className="mt-8">
        <h2 className="mb-5 text-2xl font-bold text-gray-900">
          📊 দামের সারসংক্ষেপ
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">আজকের দাম</p>
            <p className="mt-2 text-2xl font-bold text-green-700">
              ৳{toBanglaNumber(product.today)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              ৳{toBanglaNumber(minimumPrice)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              ৳{toBanglaNumber(maximumPrice)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">গড় দাম</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              ৳{toBanglaNumber(averagePrice.toFixed(0))}
            </p>
          </div>
        </div>
      </section>

      {/* Historical Price */}
      <section className="mt-8">
        <h2 className="mb-5 text-2xl font-bold text-gray-900">
          📅 আগের দামের তথ্য
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">গতকাল</p>
            <p className="mt-2 text-xl font-bold">
              ৳{toBanglaNumber(product.yesterday)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">গত সপ্তাহ</p>
            <p className="mt-2 text-xl font-bold">
              ৳{toBanglaNumber(product.lastWeek)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <p className="text-sm text-gray-500">গত মাস</p>
            <p className="mt-2 text-xl font-bold">
              ৳{toBanglaNumber(product.lastMonth)}
            </p>
          </div>
        </div>
      </section>

      {/* Market Prices */}
      <section className="mt-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            🏪 বাজারভিত্তিক বর্তমান দাম
          </h2>

          <p className="mt-2 text-gray-600">
            বিভিন্ন বাজারে এই পণ্যের সর্বনিম্ন ও সর্বোচ্চ দাম।
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-5 py-4 font-bold text-gray-800">
                    বাজার
                  </th>

                  <th className="px-5 py-4 font-bold text-gray-800">
                    বিভাগ
                  </th>

                  <th className="px-5 py-4 font-bold text-gray-800">
                    সর্বনিম্ন
                  </th>

                  <th className="px-5 py-4 font-bold text-gray-800">
                    সর্বোচ্চ
                  </th>
                </tr>
              </thead>

              <tbody>
                {product.markets.map((market) => (
                  <tr
                    key={`${market.market}-${market.division}`}
                    className="border-t border-gray-100"
                  >
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {market.market}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {market.division}
                    </td>

                    <td className="px-5 py-4 font-semibold text-green-700">
                      ৳{toBanglaNumber(market.min)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-red-600">
                      ৳{toBanglaNumber(market.max)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
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

        <div className="mt-6 h-72 rounded-3xl bg-gray-200" />

        <div className="mt-8 h-8 w-56 rounded bg-gray-200" />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-gray-200"
            />
          ))}
        </div>
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