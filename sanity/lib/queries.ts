import { defineQuery } from "next-sanity";

export const GAMES_QUERY =
  defineQuery(`*[_type == "game" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search] | order(_createdAt desc) {
        _id,
        title,
        _createdAt,
        slug,
        author->{
        _id,
        name,
        username,
        image,
        followers
        },
        views,
        followers,
        description,
        category,
        image,
        comments[] {
          author->{
            name,
            username
          },
          comment,
          createdAt
        },
        likes[] {
          author->{
            name,
            username
          }
        }
    }`);

export const GAME_BY_ID_QUERY = `
  *[_type == "game" && _id == $id][0] {
    _id,
    title,
    _createdAt,
    slug,
    author->{
      name,
      username,
      image,
      followers
    },
    views,
    followers,
    description,
    category,
    image,
    comments[] {
      author->{
        name,
        username
      },
      comment,
      createdAt
    },
    likes[] {
      author->{
        name,
        username
      }
    }
  }
`;

export const POSTS_BY_GAME_QUERY = `
  *[_type == "post" && game._ref == $gameId] | order(_createdAt desc) {
    _id,
    title,
    slug,
    image,
    content,
    _createdAt,
    comments[] {
      author->{
        name,
        username
      },
      comment,
      createdAt
    },
    likes[] {
      author->{
        name,
        username
      }
    }
  }
`;

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
  *[_type == "author" && id == $id][0]{
      _id,
      id,
      name,
      username,
      email,
      image,
      bio
  }
  `);

export const AUTHOR_BY_ID_QUERY = defineQuery(`
    *[_type == "author" && _id == $id][0]{
        _id,
        id,
        name,
        username,
        email,
        image,
        bio
    }
    `);

export const GAMES_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "game" && author._ref ==$id] | order(_createdAt desc) {
        _id,
        title,
        _createdAt,
        slug,
        author->{
        name,
        username,
        image,
        followers
        },
        views,
        followers,
        description,
        category,
        image,
        comments[] {
          author->{
            name,
            username
          },
          comment,
          createdAt
        },
        likes[] {
          author->{
            name,
            username
          }
        }
    }`);
