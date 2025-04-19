import Image from "next/image";
import SearchForm from "@/components/ui/SearchForm";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

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
    </>
  );
}
