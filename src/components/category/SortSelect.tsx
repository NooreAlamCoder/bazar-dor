"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "";

  function handleChange(value: string) {
    if (value === "") {
      router.push(window.location.pathname);
    } else {
      router.push(`${window.location.pathname}?sort=${value}`);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="sort"
        className="text-base font-medium text-gray-500"
      >
        সাজান
      </label>

      <select
        id="sort"
        value={currentSort}
        onChange={(event) => handleChange(event.target.value)}
        className="h-12 min-w-[130px] cursor-pointer appearance-none rounded-xl border border-gray-300 bg-white px-4 pr-10 text-base font-medium text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      >
        <option value="">ডিফল্ট</option>
        <option value="low">দাম: কম থেকে বেশি</option>
        <option value="high">দাম: বেশি থেকে কম</option>
      </select>
    </div>
  );
}