"use client";

import { ShareIcon, BookmarkIcon } from "lucide-react";
import LikeButton from "./LikeButton";

interface PostActionsProps {
  postId: string;
  initialLikes: any[];
  currentUser: any;
}

export default function PostActions({ postId, initialLikes, currentUser }: PostActionsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
      <div className="space-y-3">
        <LikeButton postId={postId} initialLikes={initialLikes} currentUser={currentUser} />
        
        <button className="flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-md active:scale-95">
          <ShareIcon className="w-5 h-5" />
          <span>Share Post</span>
        </button>
        
        <button className="flex items-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover:scale-105 shadow-md active:scale-95">
          <BookmarkIcon className="w-5 h-5" />
          <span>Bookmark</span>
        </button>
      </div>
    </div>
  );
} 