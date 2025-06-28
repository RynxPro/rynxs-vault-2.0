import React from "react";
import { client } from "@/sanity/lib/client";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { 
  MessageCircleIcon, 
  HeartIcon, 
  CalendarIcon, 
  ArrowLeftIcon,
  Gamepad2Icon,
  EyeIcon
} from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import CommentSection from "@/components/ui/CommentSection";
import PostActions from "@/components/ui/PostActions";
import { auth } from "@/auth";

// Query for a single post with all details
const POST_BY_ID_QUERY = `
  *[_type == "post" && _id == $id][0] {
    _id,
    title,
    slug,
    content,
    image,
    _createdAt,
    views,
    author->{
      _id,
      name,
      username,
      image,
      bio
    },
    game->{
      _id,
      title,
      category,
      image
    },
    comments[] {
      _key,
      _ref
    },
    likes[]->{
      _id,
      name,
      username
    }
  }
`;

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await client.fetch(POST_BY_ID_QUERY, { id });
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} - Rynx's Vault`,
    description: post.content?.substring(0, 160) || `Read ${post.title} by ${post.author?.name}`,
    keywords: [post.game?.category, "game development", "indie games", post.author?.name],
    openGraph: {
      title: `${post.title} - Rynx's Vault`,
      description: post.content?.substring(0, 160) || `Read ${post.title} by ${post.author?.name}`,
      images: post.image ? [{ url: post.image, alt: post.title }] : [],
      type: "article",
      authors: [post.author?.name],
      publishedTime: post._createdAt,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} - Rynx's Vault`,
      description: post.content?.substring(0, 160) || `Read ${post.title} by ${post.author?.name}`,
      images: post.image ? [post.image] : [],
    },
  };
}

const PostDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth();

  // Fetch post data
  let post;
  let error = null;

  try {
    post = await client.fetch(POST_BY_ID_QUERY, { id });
    
    // Increment views when post is viewed
    if (post) {
      // Import the action dynamically to avoid server/client issues
      const { incrementPostViews } = await import("@/lib/actions");
      await incrementPostViews(id);
    }
  } catch (err) {
    error = err as Error;
  }

  if (error || !post) {
    notFound();
  }

  // Fetch comments properly
  let comments = [];
  if (post.comments && post.comments.length > 0) {
    try {
      const commentRefs = post.comments.map((ref: any) => ref._ref);
      const commentDocuments = await client.fetch(`
        *[_type == "comment" && _id in $commentRefs] | order(createdAt asc) {
          _id,
          comment,
          createdAt,
          author-> {
            _id,
            name,
            username,
            image
          }
        }
      `, { commentRefs });

      // Map the comments back to include the _key from the post
      comments = commentDocuments.map((comment: any) => {
        const postComment = post.comments.find((ref: any) => ref._ref === comment._id);
        return {
          ...comment,
          _key: postComment?._key || comment._id
        };
      });
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Back Button */}
            <div className="flex justify-start mb-6">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-primary-100 hover:text-white transition-colors"
                aria-label="Go back to homepage"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>

            {/* Post Meta */}
            <div className="flex justify-center items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-primary-100">
                <CalendarIcon className="w-5 h-5" />
                <time dateTime={post._createdAt} className="font-medium">
                  {formatDate(post._createdAt)}
                </time>
              </div>
              <div className="flex items-center gap-2 text-primary-100">
                <EyeIcon className="w-5 h-5" />
                <span className="font-medium">{post.views || 0} views</span>
              </div>
              <div className="flex items-center gap-2 text-primary-100">
                <MessageCircleIcon className="w-5 h-5" />
                <span className="font-medium">{post.comments?.length || 0} comments</span>
              </div>
              <div className="flex items-center gap-2 text-primary-100">
                <HeartIcon className="w-5 h-5" />
                <span className="font-medium">{post.likes?.length || 0} likes</span>
              </div>
            </div>

            {/* Post Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Link href={`/user/${post.author?._id}`} className="group">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    image={post.author?.image}
                    name={post.author?.name}
                    size={48}
                    className="border-2 border-white/20 group-hover:border-white transition-colors group-hover:scale-105 shadow-md"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-white group-hover:text-primary-100 transition-colors">
                      {post.author?.name}
                    </p>
                    <p className="text-primary-200 text-sm">
                      @{post.author?.username}
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Game Reference */}
            {post.game && (
              <Link href={`/game/${post.game._id}`} className="inline-block">
                <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                  <Gamepad2Icon className="w-4 h-4" />
                  <span className="font-medium">About: {post.game.title}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Post Image */}
            {post.image && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={post.image}
                    alt={`Image for ${post.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Post Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <CommentSection postId={post._id} initialComments={comments} currentUser={session} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Like and Share */}
            <PostActions postId={post._id} initialLikes={post.likes || []} currentUser={session} />

            {/* Game Info */}
            {post.game && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Game</h3>
                <Link href={`/game/${post.game._id}`} className="group block">
                  <div className="space-y-3">
                    {post.game.image && (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={post.game.image}
                          alt={`Screenshot of ${post.game.title}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {post.game.title}
                      </h4>
                      <p className="text-sm text-gray-600">{post.game.category}</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Author Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
              <Link href={`/user/${post.author?._id}`} className="group block">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    image={post.author?.image}
                    name={post.author?.name}
                    size={56}
                    className="border-2 border-gray-200 group-hover:border-primary-500 transition-colors group-hover:scale-105 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                      {post.author?.name}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">@{post.author?.username}</p>
                    {post.author?.bio && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {post.author.bio}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage; 