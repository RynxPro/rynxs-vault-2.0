'use client';

import { formatDate, formatFollowNumber, formatViewNumber } from "@/lib/utils";
import { EyeIcon, StarIcon, CalendarIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Author, Game } from "@/sanity/types";
import { useState, useMemo } from "react";
import UserAvatar from "./UserAvatar";

// Custom type for author with followers count
type AuthorWithFollowers = Author & {
  followersCount?: number;
};

export type GameCardType = Omit<Game, "author"> & { author?: AuthorWithFollowers };

interface GameCardProps {
  post: GameCardType;
}

const GameCard = ({ post }: GameCardProps) => {
  const {
    _createdAt,
    views,
    followers,
    author,
    title,
    category,
    _id,
    image,
    description,
  } = post;

  const [imageError, setImageError] = useState(false);

  // Memoize formatted values for performance
  const formattedDate = useMemo(() => formatDate(_createdAt), [_createdAt]);
  const formattedViews = useMemo(() => formatViewNumber(views), [views]);
  const formattedFollowers = useMemo(() => formatFollowNumber(author?.followersCount || 0), [author?.followersCount]);

  // Validate required fields
  if (!_id || !title) {
    return (
      <div className="p-6 border border-red-200 bg-red-50 rounded-2xl">
        <p className="text-red-600 text-sm">Invalid game data</p>
      </div>
    );
  }

  return (
    <article className="group relative h-full">
      {/* Card content */}
      <div className="flex flex-col h-full">
        {/* Header with date and stats */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarIcon className="w-4 h-4" aria-hidden="true" />
            <time 
              dateTime={_createdAt} 
              className="font-medium text-[14px] bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors"
              aria-label={`Created on ${formattedDate}`}
            >
              {formattedDate}
            </time>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5" aria-label={`${formattedViews} views`}>
              <EyeIcon className="w-4 h-4 text-primary-500" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-600">
                {formattedViews}
              </span>
            </div>

            <div className="flex items-center gap-1.5" aria-label={`${formattedFollowers} followers`}>
              <StarIcon className="w-4 h-4 text-yellow-500" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-600">
                {formattedFollowers}
              </span>
            </div>
          </div>
        </header>

        {/* Author and title section */}
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="flex-1 min-w-0">
            {author && (
              <Link 
                href={`/user/${author._id}`} 
                className="group/author inline-block" 
                aria-label={`View ${author.name}'s profile`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="w-4 h-4 text-gray-600" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-600 group-hover/author:text-primary-600 transition-colors truncate">
                    {author.name}
                  </p>
                </div>
              </Link>
            )}

            <Link href={`/game/${_id}`} className="block" aria-label={`View details for ${title}`}>
              <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary-600 transition-colors">
                {title}
              </h3>
            </Link>
          </div>

          {author && (
            <Link 
              href={`/user/${author._id}`} 
              className="flex-shrink-0" 
              aria-label={`View ${author.name}'s profile`}
            >
              <div className="relative">
                <UserAvatar
                  image={author?.image || null}
                  name={author?.name || "Unknown User"}
                  size={48}
                  className="border-2 border-gray-200 transition-all duration-200 group-hover:border-primary-500 group-hover:scale-105 shadow-md active:scale-95"
                />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white" aria-hidden="true"></div>
              </div>
            </Link>
          )}
        </div>

        {/* Game image */}
        <Link href={`/game/${_id}`} className="block mb-4" aria-label={`View details for ${title}`}>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
            {imageError || !image ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ) : (
              <Image
                src={image}
                alt={`Screenshot of ${title}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                priority={false}
              />
            )}
          </div>
        </Link>

        {/* Description */}
        <Link href={`/game/${_id}`} className="block flex-1" aria-label={`View details for ${title}`}>
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
            {description || "No description available"}
          </p>
        </Link>

        {/* Footer with category and action */}
        <footer className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200/50">
          {category && (
            <Link 
              href={`/?query=${encodeURIComponent(category.toLowerCase())}`}
              className="font-medium text-[16px] bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full shadow-md text-xs hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
              aria-label={`Browse more ${category} games`}
            >
              {category}
            </Link>
          )}

          <Link href={`/game/${_id}`} aria-label={`View details for ${title}`}>
            <button className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 font-semibold text-[16px] text-white px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm hover:from-primary-600 hover:to-primary-700">
              View Details
            </button>
          </Link>
        </footer>
      </div>
    </article>
  );
};

export default GameCard;
