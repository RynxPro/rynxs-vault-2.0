import { formatDate, formatFollowNumber, formatViewNumber } from "@/lib/utils";
import { EyeIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Author, Game } from "@/sanity/types";

export type GameCardType = Omit<Game, "author"> & { author?: Author };

const GameCard = ({ post }: { post: GameCardType }) => {
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

  return (
    <li className="game-card group">
      <div className="flex-between">
        <p className="game_card_date">{formatDate(_createdAt)}</p>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1.5">
            <span className="text-16-medium">{formatViewNumber(views)}</span>
            <EyeIcon className="size-6 text-primary" />
          </div>

          <div className="flex gap-1.5">
            <span className="text-16-medium">
              {formatFollowNumber(followers)}
            </span>
            <StarIcon className="size-6 text-primary" />
          </div>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>

          <Link href={`/game/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>

        <Link href={`/user/${author?._id}`}>
          <Image
            src="https://placehold.co/48x48"
            alt="placeholder"
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/game/${_id}`}>
        <p className="game-card_desc">{description}</p>
        <img
          src={urlFor(image).width(600).url()}
          alt={title}
          className="game-card_img"
        />
      </Link>

      <div className="flex-between mt-5 gap-3">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <button className="game-card_btn">
          <Link href={`/game/${_id}`}>Details</Link>
        </button>
      </div>
    </li>
  );
};

export default GameCard;
