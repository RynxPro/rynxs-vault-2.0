import React from "react";
import { client } from "@/sanity/lib/client";
import { GAME_BY_ID_QUERY, POSTS_BY_GAME_QUERY } from "@/sanity/lib/queries";
import { formatDate, formatFollowNumber, formatViewNumber } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { BellRingIcon, EyeIcon, StarIcon, CalendarIcon, UserIcon, ExternalLinkIcon, MessageCircleIcon } from "lucide-react";
import PostList from "@/components/ui/PostList";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import UserAvatar from "@/components/ui/UserAvatar";

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const game = await client.fetch(GAME_BY_ID_QUERY, { id });
  
  if (!game) {
    return {
      title: "Game Not Found",
    };
  }

  return {
    title: `${game.title} - Rynx's Vault`,
    description: game.description,
    keywords: [game.category, "indie games", "game development", game.author?.name],
    openGraph: {
      title: `${game.title} - Rynx's Vault`,
      description: game.description,
      images: game.image ? [{ url: game.image, alt: game.title }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} - Rynx's Vault`,
      description: game.description,
      images: game.image ? [game.image] : [],
    },
  };
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Fetch game and posts data
  let game;
  let posts = [];
  let error = null;

  try {
    game = await client.fetch(GAME_BY_ID_QUERY, { id });
    
    // Increment views when game is viewed
    if (game) {
      // Import the action dynamically to avoid server/client issues
      const { incrementGameViews } = await import("@/lib/actions");
      await incrementGameViews(id);
    }
    
    if (game) {
      posts = await client.fetch(POSTS_BY_GAME_QUERY, { gameId: id });
      
      // Resolve comments for posts
      if (posts.length > 0) {
        // Get all comment references from all posts
        const allCommentRefs = posts.flatMap((post: any) => 
          post.comments?.map((comment: any) => comment._ref) || []
        );
        
        if (allCommentRefs.length > 0) {
          // Fetch all comment documents in one query
          const comments = await client.fetch(`
            *[_type == "comment" && _id in $commentRefs] {
              _id,
              comment,
              createdAt,
              author-> {
                _id,
                name,
                username,
                image
              }
            }
          `, { commentRefs: allCommentRefs });
          
          // Create a map of comment ID to comment document
          const commentMap = new Map();
          comments.forEach((comment: any) => {
            commentMap.set(comment._id, comment);
          });
          
          // Resolve comments for each post
          posts = posts.map((post: any) => ({
            ...post,
            comments: post.comments?.map((commentRef: any) => {
              const comment = commentMap.get(commentRef._ref);
              return comment ? {
                ...comment,
                _key: commentRef._key
              } : null;
            }).filter(Boolean) || []
          }));
        }
      }
    }
  } catch (err) {
    error = err as Error;
  }

  if (error || !game) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Game Stats */}
            <div className="flex justify-center items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-primary-100">
                <CalendarIcon className="w-5 h-5" />
                <time dateTime={game._createdAt} className="font-medium">
                  {formatDate(game._createdAt)}
                </time>
              </div>
              <div className="flex items-center gap-2 text-primary-100">
                <EyeIcon className="w-5 h-5" />
                <span className="font-medium">{formatViewNumber(game.views || 0)} views</span>
              </div>
              <div className="flex items-center gap-2 text-primary-100">
                <StarIcon className="w-5 h-5" />
                <span className="font-medium">{formatFollowNumber(game.followers || 0)} followers</span>
              </div>
            </div>

            {/* Game Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {game.title}
            </h1>

            {/* Category Badge */}
            <div className="inline-block mb-6">
              <span className="bg-white/20 text-white px-6 py-2 rounded-full font-semibold text-sm">
                {game.category}
              </span>
            </div>

            {/* Description */}
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              {game.description}
            </p>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Game Section */}
          <div className="lg:col-span-2">
            {/* Game Image */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={game.image || "/placeholder.png"}
                  alt={`Screenshot of ${game.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Author Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between">
                <Link
                  href={`/user/${game.author?._id}`}
                  className="flex items-center gap-4 group"
                  aria-label={`View ${game.author?.name}'s profile`}
                >
                  <div className="relative">
                    <UserAvatar
                      image={game.author?.image}
                      name={game.author?.name}
                      size={64}
                      className="border-2 border-gray-200 group-hover:border-primary-500 transition-colors group-hover:scale-105 shadow-md active:scale-95"
                    />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {game.author?.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      @{game.author?.username}
                    </p>
                  </div>
                </Link>

                <button 
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 shadow-lg"
                  aria-label="Follow this developer"
                >
                  <BellRingIcon className="w-5 h-5" />
                  <span>Follow</span>
                </button>
              </div>
            </div>

            {/* Game URL */}
            {game.gameUrl && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Play the Game</h3>
                <a
                  href={game.gameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <ExternalLinkIcon className="w-5 h-5" />
                  <span>Play Now</span>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Game Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Game Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-semibold text-gray-900">{formatViewNumber(game.views || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Followers</span>
                  <span className="font-semibold text-gray-900">{formatFollowNumber(game.followers || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-primary-600">{game.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-semibold text-gray-900">{formatDate(game._createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/post/upload"
                  className="flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 shadow-md"
                >
                  <MessageCircleIcon className="w-5 h-5" />
                  <span>Create Post</span>
                </Link>
                <button className="flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 hover:scale-105 shadow-md">
                  <StarIcon className="w-5 h-5" />
                  <span>Follow Game</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircleIcon className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Posts About This Game</h2>
            </div>
            
            {posts.length > 0 ? (
              <PostList posts={posts} />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircleIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-6">
                  Be the first to share an update about this game!
                </p>
                <Link 
                  href="/post/upload"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <MessageCircleIcon className="w-5 h-5" />
                  Create First Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
