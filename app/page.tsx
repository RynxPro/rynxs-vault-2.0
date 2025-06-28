import SearchForm from "@/components/ui/SearchForm";
import GameCard, { GameCardType } from "@/components/ui/GameCard";
import { GAMES_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import Footer from "@/components/layout/Footer";
import { Suspense } from "react";
import Link from "next/link";

// Loading component for the main content
function GameGridSkeleton() {
  return (
    <div
      className="grid md:grid-cols-3 sm:grid-cols-2 gap-6"
      role="status"
      aria-label="Loading games"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="w-full h-96 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// Error boundary component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 font-semibold text-[16px] text-white px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
}

// Empty state component
function EmptyState({ query }: { query?: string | undefined }) {
  return (
    <div className="col-span-full text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {query ? `No games found for "${query}"` : "No games available yet"}
        </h3>
        <p className="text-gray-600 mb-6">
          {query
            ? "Try adjusting your search terms or browse all games"
            : "Be the first to share your game with the community!"}
        </p>
        {!query && (
          <Link
            href="/game/upload"
            className="rounded-full bg-gradient-to-r from-primary-500 to-primary-600 font-semibold text-[16px] text-white px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Your First Game
          </Link>
        )}
      </div>
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  let posts: GameCardType[] = [];
  let error: Error | null = null;

  try {
    const result = await sanityFetch({ query: GAMES_QUERY, params });
    posts = result.data || [];
  } catch (err) {
    error = err as Error;
    console.error("Error fetching games:", err);
  }

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-background via-accent to-background min-h-[530px] flex justify-center items-center flex-col py-16 px-6 overflow-hidden">
        {/* Removed background decoration and floating elements */}
        <div className="relative z-10 text-center">
          <div className="slide-up">
            <h1 className="hero-title-gradient text-4xl sm:text-6xl font-bold tracking-tight text-foreground text-center my-6 mb-6">
              Share Your <span className="hero-title-gradient-blue">Games</span>
              , <br />
              inspire the community
            </h1>
            <p className="font-medium text-[20px] text-gray-600 max-w-2xl text-center break-words mt-2 leading-relaxed mb-8">
              Create your dev page, post updates, and turn ideas into full-blown
              games with support from others.
            </p>
          </div>

          <div className="scale-in">
            <SearchForm query={query || undefined} />
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="slide-up">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {query ? `Search results for "${query}"` : "Discover Amazing Games"}
          </h2>
          <p className="text-gray-600 mb-8">
            {query
              ? `Found ${posts.length} games matching your search`
              : "Explore the latest creations from our community"}
          </p>
        </div>

        <Suspense fallback={<GameGridSkeleton />}>
          <div className="fade-in">
            <ul
              className="grid md:grid-cols-3 sm:grid-cols-2 gap-6"
              role="list"
            >
              {posts?.length > 0 ? (
                posts.map((post: GameCardType, index: number) => (
                  <li
                    key={post?._id}
                    className="bg-white py-6 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-border/50 overflow-hidden group relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                    role="listitem"
                  >
                    <GameCard post={post} />
                  </li>
                ))
              ) : (
                <EmptyState query={query} />
              )}
            </ul>
          </div>
        </Suspense>
      </section>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
