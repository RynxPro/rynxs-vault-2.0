import Image from "next/image";
import SearchForm from "@/components/ui/SearchForm";
import GameCard from "@/components/ui/GameCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const posts = [
    {
      _createdAt: new Date(),
      views: 1393471,
      followers: 12345,
      author: {
        _id: 1,
        name: "ge lemon",
      },
      _id: "1",
      description:
        "Undertale is a critically acclaimed indie role-playing game (RPG) created by Toby Fox, released in 2015. The game is known for its unique gameplay mechanics, memorable characters, and emotional storytelling.",
      image:
        "data:image/jpeg;base64,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",
      category: "action",
      title: "Undertale",
    },
  ];

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
