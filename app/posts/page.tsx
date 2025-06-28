import React from "react";
import { client } from "@/sanity/lib/client";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";
import { Metadata } from "next";
import { MessageCircleIcon } from "lucide-react";
import PostList from "@/components/ui/PostList";
import SearchForm from "@/components/ui/SearchForm";

export const metadata: Metadata = {
  title: "All Posts - Rynx's Vault",
  description: "Discover and read posts from the gaming community. Share insights, updates, and experiences about game development.",
  keywords: ["game development", "indie games", "gaming community", "posts", "blog"],
  openGraph: {
    title: "All Posts - Rynx's Vault",
    description: "Discover and read posts from the gaming community.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Posts - Rynx's Vault",
    description: "Discover and read posts from the gaming community.",
  },
};

const PostsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;

  let posts = [];
  let error = null;

  try {
    // Get all posts and filter client-side if needed
    posts = await client.fetch(ALL_POSTS_QUERY);
    
    // Filter by query if provided
    if (query) {
      const searchTerm = query.toLowerCase();
      posts = posts.filter((post: any) => 
        post.title?.toLowerCase().includes(searchTerm) ||
        post.content?.toLowerCase().includes(searchTerm) ||
        post.author?.name?.toLowerCase().includes(searchTerm) ||
        post.game?.title?.toLowerCase().includes(searchTerm)
      );
    }
  } catch (err) {
    error = err as Error;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 font-semibold text-[16px] text-white px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <MessageCircleIcon className="w-8 h-8 text-primary-200" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Community Posts
              </h1>
            </div>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed mb-8">
              Discover insights, updates, and experiences from game developers in our community.
            </p>
            
            {/* Search Form */}
            <div className="max-w-md mx-auto">
              <SearchForm query={query} />
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? `Search results for "${query}"` : "All Posts"}
          </h2>
          <p className="text-gray-600">
            {query ? `Found ${posts.length} posts matching your search` : `Showing ${posts.length} posts from the community`}
          </p>
        </div>

        <PostList posts={posts} />
      </div>
    </div>
  );
};

export default PostsPage; 