import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-250px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-10">
        <div className="text-7xl">🛒</div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-green-600">
          404 — Page Not Found
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
          পেজটি পাওয়া যায়নি
        </h1>

        <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
          দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যাচ্ছে না।
          ঠিকানা পরিবর্তিত হতে পারে অথবা পেজটি সরিয়ে ফেলা হয়েছে।
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}