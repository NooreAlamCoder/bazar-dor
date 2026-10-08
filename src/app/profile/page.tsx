"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm">
          <div className="h-8 w-40 rounded bg-gray-200" />

          <div className="mt-6 h-20 w-full rounded-xl bg-gray-200" />

          <div className="mt-6 h-11 w-full rounded-lg bg-gray-200" />

          <div className="mt-4 h-11 w-32 rounded-lg bg-gray-200" />
        </div>
      </main>
    );
  }

  if (!session) {
    router.replace("/signin");
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("নাম লিখুন");
      return;
    }

    if (!session) {
      toast.error("সেশন পাওয়া যায়নি");
      return;
    }

    if (trimmedName === session.user.name) {
      toast.error("নতুন কোনো নাম দেওয়া হয়নি");
      return;
    }

    setSaving(true);

    const { error } = await authClient.updateUser({
      name: trimmedName,
    });

    setSaving(false);

    if (error) {
      toast.error(error.message || "প্রোফাইল আপডেট করা যায়নি");
      return;
    }

    setName("");

    toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে");

    router.refresh();
  }

  async function handleSignOut() {
    setSigningOut(true);

    const { error } = await authClient.signOut();

    setSigningOut(false);

    if (error) {
      toast.error(error.message || "সাইন আউট করা যায়নি");
      return;
    }

    toast.success("সফলভাবে সাইন আউট হয়েছে");

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-[calc(100vh-200px)] px-4 py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            আমার প্রোফাইল
          </h1>

          <p className="mt-2 text-gray-600">
            আপনার অ্যাকাউন্টের তথ্য দেখুন এবং নাম আপডেট করুন।
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {/* User Information */}
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl bg-green-50 p-4">
            {/* Left Side */}
            <div className="flex min-w-0 items-center gap-4">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  className="h-14 w-14 shrink-0 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-2xl text-white">
                  👤
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-gray-900">
                  {session.user.name}
                </p>

                <p className="truncate text-sm text-gray-500">
                  {session.user.email}
                </p>
              </div>
            </div>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex shrink-0 items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>↩</span>

              <span>
                {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
              </span>
            </button>
          </div>

          {/* Update Name */}
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              নতুন নাম
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={session.user.name}
              disabled={saving}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
            />

            <button
              type="submit"
              disabled={saving}
              className="mt-4 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "আপডেট হচ্ছে..." : "নাম আপডেট করুন"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}