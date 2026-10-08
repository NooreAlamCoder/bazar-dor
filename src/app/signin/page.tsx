"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }

    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "সাইন ইন করা যায়নি");
      return;
    }

    toast.success("সফলভাবে সাইন ইন হয়েছে");

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7 text-center">
          <div className="mb-3 text-4xl">🛒</div>

          <h1 className="text-2xl font-bold text-gray-900">
            সাইন ইন করুন
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            আপনার বাজার দর অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              ইমেইল
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="আপনার ইমেইল"
              className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="আপনার পাসওয়ার্ড"
              className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-green-600 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-semibold text-green-600 hover:text-green-700"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </main>
  );
}