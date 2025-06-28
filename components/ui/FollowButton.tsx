"use client";

import { useState, useEffect } from "react";
import { UserPlusIcon, UserMinusIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { toggleFollow } from "@/lib/actions";

interface FollowButtonProps {
  userId: string;
  currentUser?: any;
  initialFollowersCount?: number;
  isFollowing?: boolean;
}

const FollowButton = ({ userId, currentUser, initialFollowersCount = 0, isFollowing: initialIsFollowing = false }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update state when props change
    setIsFollowing(initialIsFollowing);
    setFollowersCount(initialFollowersCount);
  }, [initialIsFollowing, initialFollowersCount]);

  useEffect(() => {
    // Check if current user is viewing their own profile
    if (currentUser && currentUser.id === userId) {
      setIsFollowing(false); // Can't follow yourself
    }
  }, [currentUser, userId]);

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("Please sign in to follow users");
      return;
    }

    if (currentUser.id === userId) {
      toast.error("You cannot follow yourself");
      return;
    }

    setIsLoading(true);
    
    // Optimistic update
    const optimisticFollowing = !isFollowing;
    setIsFollowing(optimisticFollowing);
    setFollowersCount(prev => optimisticFollowing ? prev + 1 : prev - 1);
    
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("currentUserId", currentUser.id);

      const result = await toggleFollow(formData);
      
      if (result.status === "SUCCESS") {
        toast.success(optimisticFollowing ? "User followed!" : "User unfollowed!");
      } else {
        // Revert optimistic update on error
        setIsFollowing(!optimisticFollowing);
        setFollowersCount(prev => optimisticFollowing ? prev - 1 : prev + 1);
        throw new Error(result.error || "Failed to update follow status");
      }
    } catch (error) {
      toast.error("Failed to update follow status", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show follow button if user is viewing their own profile
  if (currentUser?.id === userId) {
    return null;
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        isFollowing 
          ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700' 
          : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
      }`}
      aria-label={`${isFollowing ? 'Unfollow' : 'Follow'} user`}
    >
      {isLoading ? (
        <Loader2Icon className="w-5 h-5 animate-spin" />
      ) : isFollowing ? (
        <UserMinusIcon className="w-5 h-5" />
      ) : (
        <UserPlusIcon className="w-5 h-5" />
      )}
      <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
    </button>
  );
};

export default FollowButton;