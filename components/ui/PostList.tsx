"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

export default function PostList({ posts }: { posts: any[] }) {
  const [activePost, setActivePost] = useState<any | null>(null);

  return (
    <>
      <div className="flex flex-col space-y-8 py-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-secondary border-4 border-black rounded-2xl overflow-hidden shadow-xl w-full"
          >
            <div className="flex justify-between items-center px-4 py-2 text-sm text-gray-500">
              <span>{formatDate(post._createdAt)}</span>
            </div>

            {post.image && (
              <img
                src={urlFor(post.image).url()}
                alt={post.title}
                className="w-full h-52 object-cover"
              />
            )}

            <div className="p-6 flex flex-col flex-grow">
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                {post.title}
              </h4>
              <p className="text-base text-gray-700 mb-4 flex-grow line-clamp-3">
                {post.content}
              </p>
              <button
                onClick={() => setActivePost(post)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm"
              >
                Read more
              </button>
            </div>

            <div className="flex justify-start gap-6 px-4 py-3 text-sm text-gray-500 border-t border-gray-200">
              <div className="flex items-center gap-1">
                <span>❤️</span> <span>545</span>
              </div>
              <div className="flex items-center gap-1">
                <span>💬</span> <span>438</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple popup modal */}
      {activePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-8 rounded-xl max-w-lg shadow-lg relative">
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black transition-all duration-200"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {activePost.title}
            </h2>
            <p className="text-sm text-gray-700">{activePost.content}</p>
          </div>
        </div>
      )}
    </>
  );
}
