import Link from "next/link";
import { Suspense } from "react";
import { getCategory, getProductsByCategory } from "@/lib/api";
import type { Product } from "@/types/product";
import SortSelect from "@/components/category/SortSelect";

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

      <h2 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-green-700">
        {product.nameBn}
      </h2>

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

async function CategoryContent({
  slug,
  sort,
}: {
  slug: string;
  sort: string;
}) {
  const [category, products] = await Promise.all([
    getCategory(slug).catch(() => null),
    getProductsByCategory(slug).catch(() => []),
  ]);

  // Invalid category
  if (!category) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="text-6xl">🔍</div>

          <h1 className="mt-5 text-3xl font-extrabold text-gray-900">
            ক্যাটাগরি পাওয়া যায়নি
          </h1>

          <p className="mt-3 text-gray-600">
            আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি পাওয়া যায়নি।
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  // Sorting
  const sortedProducts = [...products];

  if (sort === "low") {
    sortedProducts.sort((a, b) => a.today - b.today);
  }

  if (sort === "high") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-green-600">
          হোম
        </Link>

        <span className="mx-2">/</span>

        <span className="text-gray-800">
          {category.nameBn}
        </span>
      </div>

      {/* Category Header */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* Category Information */}
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-5xl">
              {category.icon}
            </div>

            <div>
              <p className="text-sm font-medium text-green-600">
                বাজার দর
              </p>

              <h1 className="mt-1 text-3xl font-extrabold text-gray-900 md:text-4xl">
                {category.nameBn}
              </h1>

              <p className="mt-2 text-gray-600">
                {category.nameBn} বিভাগের বর্তমান বাজারদর।
              </p>
            </div>
          </div>

          {/* Sort Dropdown */}
          <SortSelect />
        </div>
      </section>

      {/* Products */}
      <section className="mt-8">
        {sortedProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="text-5xl">📦</div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              কোনো পণ্য পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-gray-600">
              এই ক্যাটাগরিতে বর্তমানে কোনো পণ্যের তথ্য নেই।
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
            >
              ← হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {category.icon} {category.nameBn} এর পণ্য
              </h2>

              <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                {toBanglaNumber(sortedProducts.length)}টি পণ্য
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function CategoryLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="animate-pulse">
        <div className="h-5 w-40 rounded bg-gray-200" />

        <div className="mt-6 h-36 rounded-3xl bg-gray-200" />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-64 rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  return (
    <Suspense fallback={<CategoryLoading />}>
      <CategoryPageData
        params={params}
        searchParams={searchParams}
      />
    </Suspense>
  );
}

async function CategoryPageData({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { slug } = await params;
  const { sort = "" } = await searchParams;

  return (
    <CategoryContent
      slug={slug}
      sort={sort}
    />
  );
}