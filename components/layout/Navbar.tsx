import Link from "next/link";
import React from "react";
import { auth, signIn, signOut } from "@/auth";
import { BsGithub } from "react-icons/bs";
import { Gamepad2, Plus, FileText } from "lucide-react";
import DarkModeToggle from "../ui/DarkModeToggle";
import UserAvatar from "../ui/UserAvatar";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm" role="banner">
      <nav className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80 group" aria-label="Go to homepage">
          <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">Rynx&apos;s Vault</h1>
            <p className="text-xs text-gray-600">Gaming Sanctuary</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Navigation Links */}
          <div className="flex items-center gap-2" role="list">
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

          {/* Dark Mode Toggle */}
          <div className="border-l border-gray-200 pl-4">
            <DarkModeToggle />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {session && session?.user ? (
            <>
              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/game/upload">
                  <button 
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    type="button"
                    aria-label="Create new game"
                  >
                    <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                    <span>Upload Game</span>
                  </button>
                </Link>

                <Link href="/post/upload">
                  <button 
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    type="button"
                    aria-label="Create new post"
                  >
                    <FileText className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                    <span>Create Post</span>
                  </button>
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="flex sm:hidden items-center gap-2">
                <Link href="/game/upload">
                  <button 
                    className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    type="button"
                    aria-label="Create new game"
                  >
                    <Plus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                  </button>
                </Link>

                <Link href="/post/upload">
                  <button 
                    className="p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    type="button"
                    aria-label="Create new post"
                  >
                    <FileText className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                  </button>
                </Link>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <Link href={`/user/${session?.id}`} className="group" aria-label="View your profile">
                  <div className="relative">
                    <UserAvatar
                      image={session?.user?.image || null}
                      name={session?.user?.name || "User"}
                      size={40}
                      className="h-10 w-10 border-2 border-gray-200 transition-all duration-200 group-hover:border-primary-500 group-hover:scale-105 shadow-md active:scale-95"
                    />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white" aria-hidden="true"></div>
                  </div>
                </Link>

                {/* Logout Button */}
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button 
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors rounded-lg hover:bg-red-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2" 
                    type="submit"
                    aria-label="Sign out"
                  >
                    <FileText className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg hover:from-gray-900 hover:to-black transition-all duration-300 hover:scale-105 shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" 
                type="submit"
                aria-label="Sign in with GitHub"
              >
                <BsGithub className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                <span className="hidden sm:inline">Sign in with GitHub</span>
                <span className="sm:hidden">Sign in</span>
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
