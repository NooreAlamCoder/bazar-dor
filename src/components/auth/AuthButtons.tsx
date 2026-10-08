"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthButtons() {
  const router = useRouter();

  const {
    data: session,
    isPending: loading,
  } = authClient.useSession();

  async function handleSignOut() {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "সাইন আউট করা যায়নি");
      return;
    }

    toast.success("সাইন আউট হয়েছে");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-16 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:block"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        className="hidden items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100 sm:flex"
      >
        <span>👤</span>
        <span className="max-w-[120px] truncate">
          {session.user.name}
        </span>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        সাইন আউট
      </button>
    </div>
  );
}