"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { MessageCircleIcon, SendIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { Textarea } from "./textarea";
import { addComment, deleteComment, getComments } from "@/lib/actions";

export type Comment = {
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

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  currentUser?: any;
}

export default function CommentSection({ 
  postId, 
  initialComments, 
  currentUser 
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments.filter((c: Comment) => c._key));
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingComment, setDeletingComment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshComments = async () => {
    setLoading(true);
    try {
      console.log("Refreshing comments for post:", postId);
      const result = await getComments(postId);
      console.log("Get comments result:", result);
      
      if (result.status === "SUCCESS") {
        setComments((result.comments || []).filter((c: Comment) => c._key));
      } else {
        toast.error(result.error || "Failed to load comments");
      }
    } catch (err) {
      console.error("Error refreshing comments:", err);
    }
    setLoading(false);
  };

  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await addComment(formData);
      console.log("Form action result:", result);
      
      if (result.status === "SUCCESS") {
        await refreshComments();
      } else {
        toast.error(result.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Form action error:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentKey: string) => {
    if (!currentUser) {
      toast.error("Please sign in to delete comments");
      return;
    }
    setDeletingComment(commentKey);
    try {
      const formData = new FormData();
      formData.append("commentKey", commentKey);
      formData.append("postId", postId);
      const result = await deleteComment(formData);
      if (result.status === "SUCCESS") {
        toast.success("Comment deleted!");
        await refreshComments();
      } else {
        toast.error(result.error || "Failed to delete comment");
      }
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeletingComment(null);
    }
  };

  const canDeleteComment = (comment: Comment) => {
    return currentUser && comment.author?._id === currentUser.id;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <MessageCircleIcon className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h2>
      </div>
      {/* Comment Form */}
      <div className="mb-8">
        {!currentUser ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <MessageCircleIcon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <p className="text-blue-800 font-medium mb-2">Sign in to comment</p>
            <p className="text-blue-600 text-sm">Join the conversation by signing in to your account.</p>
          </div>
        ) : (
          <form action={handleFormAction} className="space-y-4">
            <div className="flex items-start gap-3">
              <UserAvatar
                image={currentUser.user?.image}
                name={currentUser.user?.name}
                size={40}
                className="flex-shrink-0 border-2 border-gray-200 shadow-sm"
              />
              <div className="flex-1">
                <Textarea
                  name="comment"
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full px-4 py-3 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl resize-none"
                  disabled={isSubmitting}
                  maxLength={1000}
                  required
                />
                <input type="hidden" name="postId" value={postId} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {newComment.length}/1000 characters
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-105 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2Icon className="w-4 h-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <SendIcon className="w-4 h-4" />
                        Post Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._key} className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <UserAvatar
                  image={comment.author?.image || null}
                  name={comment.author?.name || "Unknown User"}
                  size={32}
                  className="h-8 w-8 border-2 border-gray-200 transition-all duration-200 group-hover:border-primary-500 group-hover:scale-105 shadow-md active:scale-95"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      {comment.author ? (
                        <>
                          <Link 
                            href={`/user/${comment.author._id}`}
                            className="font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                          >
                            {comment.author.name}
                          </Link>
                          <span className="text-sm text-gray-500 ml-2">
                            @{comment.author.username}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-gray-500">
                          Deleted User
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <time 
                        dateTime={comment.createdAt} 
                        className="text-sm text-gray-500"
                      >
                        {formatDate(comment.createdAt)}
                      </time>
                      {canDeleteComment(comment) && (
                        <button
                          onClick={() => handleDeleteComment(comment._key)}
                          disabled={deletingComment === comment._key}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                          aria-label="Delete comment"
                        >
                          {deletingComment === comment._key ? (
                            <Loader2Icon className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2Icon className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {comment.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 