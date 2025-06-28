import { auth } from "@/auth";
import UserGames from "@/components/ui/UserGames";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { Metadata } from "next";
import { UserIcon, Gamepad2, MailIcon } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";

export const experimental_ppr = true;

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const id = (await params).id;
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  
  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${user.name} (@${user.username}) - Rynx's Vault`,
    description: user.bio || `Check out ${user.name}'s games and posts on Rynx's Vault`,
    keywords: [user.name, user.username, "game developer", "indie games", "gaming community"],
    openGraph: {
      title: `${user.name} (@${user.username}) - Rynx's Vault`,
      description: user.bio || `Check out ${user.name}'s games and posts on Rynx's Vault`,
      images: user.image ? [{ url: user.image, alt: user.name }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${user.name} (@${user.username}) - Rynx's Vault`,
      description: user.bio || `Check out ${user.name}'s games and posts on Rynx's Vault`,
      images: user.image ? [user.image] : [],
    },
  };
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });
  if (!user) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Profile Image */}
            <div className="mb-6">
              <div className="relative inline-block">
                <UserAvatar
                  image={user.image}
                  name={user.name}
                  size={120}
                  className="border-4 border-white shadow-xl group-hover:scale-105 active:scale-95"
                />
                <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
            </div>

            {/* User Info */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {user.name}
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <UserIcon className="w-5 h-5 text-primary-200" />
              <p className="text-xl text-primary-200 font-medium">
                @{user.username}
              </p>
            </div>

            {user.bio && (
              <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* User Stats */}
            <div className="flex justify-center items-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary-200" />
                <span className="text-primary-200 font-medium">Game Developer</span>
              </div>
              {user.email && (
                <div className="flex items-center gap-2">
                  <MailIcon className="w-5 h-5 text-primary-200" />
                  <span className="text-primary-200 font-medium">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <Gamepad2 className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {session?.id === id ? "Your Games" : `${user.name}'s Games`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense fallback={
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gamepad2 className="w-8 h-8 text-gray-400 animate-pulse" />
                </div>
                <p className="text-gray-600">Loading games...</p>
              </div>
            }>
              <UserGames id={id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
