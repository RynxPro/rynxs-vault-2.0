"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { HeartIcon } from "lucide-react";
import { MessageSquare } from "lucide-react";
import markdownit from "markdown-it";

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
});

export default function PostList({ posts }: { posts: any[] }) {
  return (
    <>
      <div className="flex flex-col space-y-8 py-8">
        {posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </>
  );
}

function PostItem({ post }: { post: any }) {
  const [commentsVisible, setCommentsVisible] = useState(false);

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  const parsedContent = md.render(post.content);

  return (
    <div className="bg-secondary border-4 border-black rounded-2xl overflow-hidden shadow-xl w-full">
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
        <h4 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h4>
        {parsedContent ? (
          <article
            className="prose max-w-4xl font-work-sans break-all"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        ) : (
          <p className="no-result">No details provided</p>
        )}
      </div>

      <div className="flex justify-start gap-6 px-4 py-3 text-sm text-gray-500 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <span>
            <HeartIcon />
          </span>{" "}
          <span>{post.likes?.length || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>
            <MessageSquare />
          </span>{" "}
          <span className="cursor-pointer" onClick={toggleComments}>
            {post.comments?.length || 0} Comments
          </span>
        </div>
      </div>

      {/* Comments section */}
      {commentsVisible && (
        <div className="px-4 py-3 text-sm text-gray-500 border-t border-gray-200">
          {post.comments?.map((comment: any, index: number) => (
            <div key={index} className="mb-2">
              <p className="text-xs text-gray-400">
                {formatDate(comment.createdAt)}
              </p>
              <p className="font-semibold flex flex-col">
                {comment.author?.name || comment.author?.username}
              </p>
              <p>{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
