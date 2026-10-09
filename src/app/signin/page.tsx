
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  // লগইনের পর কোথায় ফিরে যাবে তা নির্ধারণ
  function getCallbackURL() {
    const params = new URLSearchParams(window.location.search);
    const requestedURL = params.get("callbackURL");

    if (
      requestedURL &&
      requestedURL.startsWith("/") &&
      !requestedURL.startsWith("//")
    ) {
      return requestedURL;
    }

    return "/";
  }

  // Email and Password Sign In
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }

    const callbackURL = getCallbackURL();

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "সাইন ইন করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে");

      router.replace(callbackURL);
      router.refresh();
    } catch {
      toast.error("সাইন ইন করার সময় সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  // Google Sign In
  async function handleGoogleSignIn() {
    const callbackURL = getCallbackURL();

    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "Google দিয়ে সাইন ইন করা যায়নি");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Google দিয়ে সাইন ইন করার সময় সমস্যা হয়েছে");
      setGoogleLoading(false);
    }
  }

  // GitHub Sign In
  async function handleGithubSignIn() {
    const callbackURL = getCallbackURL();

    setGithubLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "GitHub দিয়ে সাইন ইন করা যায়নি");
        setGithubLoading(false);
      }
    } catch {
      toast.error("GitHub দিয়ে সাইন ইন করার সময় সমস্যা হয়েছে");
      setGithubLoading(false);
    }
  }

  const anyLoading = loading || googleLoading || githubLoading;

  return (
    <main className="min-h-[calc(100vh-200px)] px-4 pt-[34px] pb-[120px]">
      {/* Page Heading */}
      <div className="mx-auto mb-[25px] w-full max-w-[416px] text-center">
        <h1 className="text-[27px] font-bold leading-[1.2] text-gray-900">
          সাইন ইন
        </h1>

        <p className="mt-[7px] text-[14px] leading-6 text-gray-500">
          বাজারদর দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* Sign In Card */}
      <div className="mx-auto w-full max-w-[416px] rounded-[17px] border border-gray-200 bg-white px-[24px] py-[25px] shadow-sm">
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-[8px] block text-[14px] font-semibold text-gray-800"
            >
              ইমেইল
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={anyLoading}
              required
              className="h-[41px] w-full rounded-[8px] border border-gray-200 bg-white px-[12px] text-[14px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          {/* Password */}
          <div className="mt-[17px]">
            <label
              htmlFor="password"
              className="mb-[8px] block text-[14px] font-semibold text-gray-800"
            >
              পাসওয়ার্ড
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="আপনার পাসওয়ার্ড দিন"
              disabled={anyLoading}
              required
              className="h-[41px] w-full rounded-[8px] border border-gray-200 bg-white px-[12px] text-[14px] text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={anyLoading}
            className="mt-[17px] flex h-[41px] w-full items-center justify-center rounded-[8px] bg-green-600 text-[14px] font-semibold text-white shadow-[0_2px_3px_rgba(0,0,0,0.18)] transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-[17px] flex items-center gap-[15px]">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="shrink-0 text-[12px] text-gray-500">
            অথবা
          </span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-[8px]">
          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={anyLoading}
            className="flex h-[41px] min-w-0 items-center justify-center gap-[7px] overflow-hidden rounded-[8px] border border-gray-200 bg-white px-[7px] text-[13px] font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="h-[15px] w-[15px] shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="shrink-0"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.71-.06-1.39-.18-2.05H12v3.88h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.19Z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.75c2.63 0 4.84-.87 6.45-2.34l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.5A9.75 9.75 0 0 0 12 21.75Z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 13.87A5.86 5.86 0 0 1 6.23 12c0-.65.11-1.28.31-1.87v-2.5H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.37l3.25-2.5Z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.1c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.21 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.71 5.38l3.25 2.5C7.31 7.82 9.46 6.1 12 6.1Z"
                />
              </svg>
            )}

            <span className="whitespace-nowrap">
              {googleLoading
                ? "অপেক্ষা করুন..."
                : "Google দিয়ে চালিয়ে যান"}
            </span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={handleGithubSignIn}
            disabled={anyLoading}
            className="flex h-[41px] min-w-0 items-center justify-center gap-[7px] overflow-hidden rounded-[8px] border border-gray-200 bg-white px-[7px] text-[13px] font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {githubLoading ? (
              <span className="h-[15px] w-[15px] shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0 text-gray-900"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.12c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18A10.9 10.9 0 0 1 12 6.1c.97 0 1.94.13 2.85.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.25 5.68.41.35.78 1.04.78 2.1v3.12c0 .3.2.65.79.54A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
            )}

            <span className="whitespace-nowrap">
              {githubLoading
                ? "অপেক্ষা করুন..."
                : "GitHub দিয়ে চালিয়ে যান"}
            </span>
          </button>
        </div>

        {/* Sign Up */}
        <p className="mt-[17px] text-center text-[13px] text-gray-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-semibold text-green-600 transition hover:text-green-700"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      {/* Back Home */}
      <div className="mt-[25px] text-center">
        <Link
          href="/"
          className="text-[13px] text-gray-500 transition hover:text-green-600"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
