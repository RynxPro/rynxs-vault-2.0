import React from "react";
import { client } from "@/sanity/lib/client";
import { GAME_BY_ID_QUERY, POSTS_BY_GAME_QUERY } from "@/sanity/lib/queries";
import { formatDate } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import Image from "next/image";
import { BellRingIcon } from "lucide-react";
import dynamic from "next/dynamic";
import PostList from "@/components/ui/PostList";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  // Fetch game and posts data
  const game = await client.fetch(GAME_BY_ID_QUERY, { id });
  if (!game) {
    return (
      <section className="main_container bg-paper">
        <h1 className="heading">Game not found</h1>
      </section>
    );
  }
  const posts = await client.fetch(POSTS_BY_GAME_QUERY, { gameId: id });

  return (
    <>
      <section className="main_container !min-h-[230px] bg-paper">
        <p className="tag">{formatDate(game?._createdAt)}</p>
        <h1 className="heading">{game.title}</h1>
        <p className="sub-heading !max-w-5xl">{game.description}</p>
      </section>

      <section className="section_container bg-paper mt-10 bg-third border-black border-3 rounded-2xl">
        <div className="flex justify-center">
          <img
            src={game.image}
            alt="plcaeholder"
            className="w-[500] max-h-700 rounded-xl border-3 border-black p-2 bg-white shadow-2xs shadow-black"
          />
        </div>

        <div className="space-y-5 mt-10 max-w-4xl border-black border-3 bg-white rounded-2xl mx-auto p-6 shadow-xl ring-1 ring-black/10">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${game.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <img
                src={game.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{game.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{game.author.username}
                </p>
              </div>
            </Link>

            <p className="category-tag flex items-center ">
              Follow
              <BellRingIcon />
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto flex flex-row gap-10">
        <div className="top-posts bg-third mt-10 rounded-2xl p-6 border-black border-3 w-3xl">
          <h2 className="heading">Posts</h2>
          <PostList posts={posts} />
        </div>
        <div className="posts max-h-100  bg-third mt-10 rounded-2xl p-6 border-black border-3">
          <h2 className="heading">Top Posts</h2>
          <h2 className="heading">Coming Soon...</h2>
          <p>sorry lol</p>
        </div>
      </section>
    </>
  );
};

export default page;
