"use client";

import { formatDate } from "@/lib/utils";
import { EyeIcon, MessageCircleIcon, CalendarIcon, HeartIcon, Gamepad2Icon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Post, Author, Game } from "@/sanity/types";
import { useState } from "react";
import UserAvatar from "./UserAvatar";

// Custom type for resolved comments
export type ResolvedComment = {
  _id: string;
  _key: string;
  comment: string;
  createdAt: string;
  author?: {
    _id: string;
    name: string;
    username: string;
    image?: string;
  };
};

export type PostCardType = Omit<Post, "author" | "game" | "comments"> & { 
  author?: Author; 
  game?: Game;
  comments?: ResolvedComment[];
};

const PostList = ({ posts }: { posts: PostCardType[] }) => {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (postId: string) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  const getImageSrc = (image: any, postId: string) => {
    if (imageErrors[postId]) {
      return '/placeholder.png';
    }
    
    // Handle both Sanity image objects and string URLs
    if (typeof image === 'string') {
      return image;
    }
    
    if (image && typeof image === 'object' && image.asset) {
      return image.asset.url || '/placeholder.png';
    }
    
    return '/placeholder.png';
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircleIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">
            Be the first to share your thoughts about games!
          </p>
          <Link 
            href="/post/upload"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <MessageCircleIcon className="w-5 h-5" />
            Create Your First Post
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        // Find the first comment with a valid _key
        const firstValidComment = post.comments?.find(c => c._key);
        return (
          <article key={post._id} className="group">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Author and date */}
                    <div className="flex items-center gap-3 mb-3">
                      <Link href={`/user/${post.author?._id}`} className="flex-shrink-0">
                        <div className="relative">
                          <UserAvatar
                            image={post.author?.image || null}
                            name={post.author?.name || "Unknown User"}
                            size={32}
                            className="h-8 w-8 border-2 border-gray-200 transition-all duration-200 group-hover:border-primary-500 group-hover:scale-105 shadow-md active:scale-95"
                          />
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                        </div>
                      </Link>
                      
                      <div className="flex-1 min-w-0">
                        <Link href={`/user/${post.author?._id}`}>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                            {post.author?.name}
                          </p>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CalendarIcon className="w-3 h-3" />
                          <time dateTime={post._createdAt} className="font-medium">
                            {formatDate(post._createdAt)}
                          </time>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/post/${post._id}`} className="block">
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Game reference */}
                    {post.game && (
                      <Link href={`/game/${post.game._id}`} className="inline-block">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full hover:bg-primary-100 transition-colors">
                          <Gamepad2Icon className="w-3 h-3" />
                          About: {post.game.title}
                        </span>
                      </Link>
                    )}
                  </div>

                  {/* Post image */}
                  {post.image && (
                    <Link href={`/post/${post._id}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={getImageSrc(post.image, post._id)}
                          alt={`Image for ${post.title}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={() => handleImageError(post._id)}
                          sizes="96px"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <Link href={`/post/${post._id}`} className="block">
                  <p className="text-gray-700 leading-relaxed line-clamp-3 mb-4">
                    {post.content}
                  </p>
                </Link>

                {/* Latest Comment Preview */}
                {firstValidComment && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-2">
                      <UserAvatar
                        image={firstValidComment.author?.image || null}
                        name={firstValidComment.author?.name || "Unknown User"}
                        size={24}
                        className="flex-shrink-0 border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-900">
                            {firstValidComment.author?.name || "Unknown User"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {firstValidComment.createdAt ? formatDate(firstValidComment.createdAt) : "Unknown date"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {firstValidComment.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <HeartIcon className="w-4 h-4 text-red-500" />
                      <span>{post.likes?.length || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircleIcon className="w-4 h-4 text-blue-500" />
                      <span>{post.comments?.length || 0} comments</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <EyeIcon className="w-4 h-4 text-gray-400" />
                      <span>Read more</span>
                    </div>
                  </div>

                  <Link href={`/post/${post._id}`}>
                    <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 shadow-md active:scale-95">
                      Read Post
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PostList;
