"use client";

import { useState, useEffect } from "react";
import { HeartIcon } from "lucide-react";
import { toast } from "sonner";
import { toggleLike } from "@/lib/actions";

interface Like {
  _id: string;
  name: string;
  username: string;
}

interface LikeButtonProps {
  postId: string;
  initialLikes: Like[];
  currentUser?: any;
}

const LikeButton = ({ postId, initialLikes, currentUser }: LikeButtonProps) => {
  const [likes, setLikes] = useState<Like[]>(initialLikes);
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Check if current user has liked the post
    if (currentUser && initialLikes) {
      const userLiked = initialLikes.some(like => like._id === currentUser.id);
      setIsLiked(userLiked);
    }
  }, [currentUser, initialLikes]);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please sign in to like posts");
      return;
    }

    setIsLiking(true);
    
    try {
      const formData = new FormData();
      formData.append("postId", postId);

      const result = await toggleLike({}, formData);
      
      if (result.status === "SUCCESS") {
        // Update the likes state based on the result
        if (result.liked) {
          // Add current user to likes
          setLikes(prev => [...prev, { 
            _id: currentUser.id, 
            name: currentUser.user?.name || "You", 
            username: currentUser.user?.username || "you" 
          }]);
          setIsLiked(true);
        } else {
          // Remove current user from likes
          setLikes(prev => prev.filter(like => like._id !== currentUser.id));
          setIsLiked(false);
        }
        toast.success(result.liked ? "Post liked!" : "Post unliked!");
      } else {
        throw new Error(result.error || "Failed to update like");
      }
    } catch (error) {
      toast.error("Failed to update like", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLiking}
      className={`flex items-center gap-2 w-full px-4 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        isLiked 
          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
      }`}
      aria-label={`${likes.length} likes`}
    >
      <HeartIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}</span>
    </button>
  );
};

export default LikeButton; 