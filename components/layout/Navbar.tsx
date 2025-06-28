import Link from "next/link";
import React from "react";
import { auth, signIn } from "@/auth";
import { BsGithub } from "react-icons/bs";
import { Gamepad2 } from "lucide-react";
import DarkModeToggle from "../ui/DarkModeToggle";
import UserMenu from "../ui/UserMenu";

const Navbar = async () => {
  const session = await auth();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm"
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80 group"
          aria-label="Go to homepage"
        >
          <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">
              Rynx&apos;s Vault
            </h1>
            <p className="text-xs text-gray-600">Gaming Sanctuary</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 ml-8">
          <Link
            href="/"
            className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            role="listitem"
          >
            Home
          </Link>
          <Link
            href="/posts"
            className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            role="listitem"
          >
            Posts
          </Link>
          <Link
            href="/studio"
            className="px-3 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            role="listitem"
          >
            Studio
          </Link>
        </div>

        {/* Divider and Dark Mode Toggle */}
        <div className="flex items-center gap-6 ml-8 border-l border-gray-200 pl-6">
          <DarkModeToggle />
          {/* User Actions Dropdown (client component) */}
          <UserMenu session={session} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
