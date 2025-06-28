"use client";

import { useState, useEffect } from "react";
import { StarIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { toggleGameFollow } from "@/lib/actions";

interface GameFollowButtonProps {
  gameId: string;
  currentUser?: any;
  initialFollowersCount?: number;
  isFollowing?: boolean;
}

const GameFollowButton = ({ gameId, currentUser, initialFollowersCount = 0, isFollowing: initialIsFollowing = false }: GameFollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update state when props change
    setIsFollowing(initialIsFollowing);
    setFollowersCount(initialFollowersCount);
  }, [initialIsFollowing, initialFollowersCount]);

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("Please sign in to follow games");
      return;
    }

    setIsLoading(true);
    
    // Optimistic update
    const optimisticFollowing = !isFollowing;
    setIsFollowing(optimisticFollowing);
    setFollowersCount(prev => optimisticFollowing ? prev + 1 : prev - 1);
    
    try {
      const formData = new FormData();
      formData.append("gameId", gameId);
      formData.append("currentUserId", currentUser.id);

      const result = await toggleGameFollow(formData);
      
      if (result.status === "SUCCESS") {
        toast.success(optimisticFollowing ? "Game followed!" : "Game unfollowed!");
      } else {
        // Revert optimistic update on error
        setIsFollowing(!optimisticFollowing);
        setFollowersCount(prev => optimisticFollowing ? prev - 1 : prev + 1);
        throw new Error(result.error || "Failed to update game follow status");
      }
    } catch (error) {
      toast.error("Failed to update game follow status", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 w-full px-4 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        isFollowing 
          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg' 
          : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md'
      }`}
      aria-label={`${isFollowing ? 'Unfollow' : 'Follow'} game`}
    >
      {isLoading ? (
        <Loader2Icon className="w-5 h-5 animate-spin" />
      ) : (
        <StarIcon className={`w-5 h-5 ${isFollowing ? 'fill-current' : ''}`} />
      )}
      <span>{isLoading ? 'Updating...' : (isFollowing ? 'Unfollow Game' : 'Follow Game')}</span>
    </button>
  );
};

export default GameFollowButton; 