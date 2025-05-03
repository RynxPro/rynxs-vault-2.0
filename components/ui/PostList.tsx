"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { HeartIcon } from "lucide-react";
import { MessageSquare } from "lucide-react";
import markdownit from "markdown-it";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="bg-white border-3 border-black rounded-2xl overflow-hidden shadow-xl w-full transition-transform hover:scale-[1.01] hover:shadow-2xl text-gray-800">
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

      <div className="flex justify-start gap-10 px-4 sm:px-6 md:px-8 lg:px-10 py-4 text-base text-gray-700 border-t-2 border-gray-300 font-medium">
        <div
          className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-transform hover:scale-110"
          title="Like post"
        >
          <span>
            <HeartIcon />
          </span>
          <span>{post.likes?.length || 0}</span>
        </div>
        <div
          className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-transform hover:scale-110"
          title="View comments"
        >
          <span>
            <MessageSquare />
          </span>
          <span onClick={toggleComments}>
            {post.comments?.length || 0} Comments
          </span>
        </div>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {commentsVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200 space-y-4 overflow-hidden"
          >
            {post.comments?.map((comment: any, index: number) => (
              <div key={index} className="p-3 rounded-lg bg-white shadow">
                <p className="text-xs text-gray-400">
                  {formatDate(comment.createdAt)}
                </p>
                <p className="font-semibold text-sm text-gray-800">
                  {comment.author?.name || comment.author?.username}
                </p>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
