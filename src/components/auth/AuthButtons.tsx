"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthButtons() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const {
    data: session,
    isPending: loading,
  } = authClient.useSession();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleSignOut() {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "সাইন আউট করা যায়নি");
      return;
    }

    setOpen(false);
    toast.success("সাইন আউট হয়েছে");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
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

  const user = session.user;

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* User Button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-100"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {/* Profile Image */}
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "Profile"}
            className="h-9 w-9 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        {/* User Name */}
        <span className="hidden max-w-[130px] truncate text-sm font-semibold text-gray-800 sm:block">
          {user.name}
        </span>

        {/* Arrow */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`hidden text-gray-500 transition-transform sm:block ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[270px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
          role="menu"
        >
          {/* User Information */}
          <div className="border-b border-gray-100 px-4 py-4">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  className="h-11 w-11 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-base font-bold text-green-700">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {user.name}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="p-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
              role="menuitem"
            >
              <span className="text-base">👤</span>
              <span>আমার প্রোফাইল</span>
            </Link>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              role="menuitem"
            >
              <span className="text-base">↩</span>
              <span>সাইন আউট</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}