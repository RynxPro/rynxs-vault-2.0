"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { Plus, FileText, LogOut, User } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { BsGithub } from "react-icons/bs";

export default function UserMenu({ session }: { session: any }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (session && session.user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Open user menu"
          className="focus:outline-none"
        >
          <UserAvatar
            image={session.user.image || null}
            name={session.user.name || "User"}
            size={40}
            className="h-10 w-10 border-2 border-gray-200 transition-all duration-200 hover:border-primary-500 hover:scale-105 shadow-md active:scale-95"
          />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
            <Link
              href={`/user/${session.id}`}
              className="flex items-center gap-3 px-5 py-3 text-gray-800 dark:text-white font-bold hover:bg-primary-600 focus:bg-primary-600 hover:text-white focus:text-white transition-colors rounded-t-xl focus:outline-none"
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
            <Link
              href="/game/upload"
              className="flex items-center gap-3 px-5 py-3 text-primary-700 dark:text-primary-200 hover:bg-primary-50 dark:hover:bg-primary-800 hover:border-l-4 hover:border-primary-500 dark:hover:border-primary-300 transition-colors focus:bg-primary-50 dark:focus:bg-primary-800 focus:outline-none"
            >
              <Plus className="w-5 h-5" />
              Upload Game
            </Link>
            <Link
              href="/post/upload"
              className="flex items-center gap-3 px-5 py-3 text-green-700 dark:text-green-200 hover:bg-green-50 dark:hover:bg-green-800 hover:border-l-4 hover:border-green-500 dark:hover:border-green-300 transition-colors focus:bg-green-50 dark:focus:bg-green-800 focus:outline-none"
            >
              <FileText className="w-5 h-5" />
              Create Post
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 w-full px-5 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 hover:border-l-4 hover:border-red-500 dark:hover:border-red-400 transition-colors rounded-b-xl font-semibold focus:bg-red-50 dark:focus:bg-red-900 focus:outline-none"
              type="button"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }
  // Not logged in
  return (
    <button
      onClick={() => signIn("github")}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg hover:from-gray-900 hover:to-black transition-all duration-300 hover:scale-105 shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      type="button"
      aria-label="Sign in with GitHub"
    >
      <BsGithub
        className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
        aria-hidden="true"
      />
      <span className="hidden sm:inline">Sign in with GitHub</span>
      <span className="sm:hidden">Sign in</span>
    </button>
  );
}
