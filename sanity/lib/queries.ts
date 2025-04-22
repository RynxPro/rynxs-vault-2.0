import { defineQuery } from "next-sanity";

export const GAMES_QUERY =
  defineQuery(`*[_type == "game" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search] | order(_createdAt desc) {
        _id,
        title,
        _createdAt,
        slug,
        author->{
        name,
        image
        },
        views,
        followers,
        description,
        category,
        image
    }`);
