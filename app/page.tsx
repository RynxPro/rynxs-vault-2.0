import Image from "next/image";
import SearchForm from "@/components/ui/SearchForm";
import GameCard, { GameCardType } from "@/components/ui/GameCard";
import { GAMES_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const { data: posts } = await sanityFetch({ query: GAMES_QUERY });

  return (
    <>
      <section className="main_container bg-paper">
        <h1 className="heading">
          Share You're <span className="text-primary">Games</span>, <br />
          inspire the community
        </h1>

        <p className="sub-heading">
          Create your dev page, post updates, and turn ideas into full-blown
          games with support from others.
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Games"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: GameCardType) => (
              <GameCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No games found</p>
          )}
        </ul>
      </section>
    </>
  );
}
