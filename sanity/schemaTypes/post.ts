import { defineField, defineType } from "sanity";


export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Post Title",
      validation: (Rule) =>
        Rule.required().error("A title is required for the post"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "game",
      type: "reference",
      to: { type: "game" },
      title: "Game",
      validation: (Rule) =>
        Rule.required().error("Post must be linked to a game"),
    }),
    defineField({
      name: "content",
      type: "markdown",
      title: "Content",
      validation: (Rule) => Rule.required().error("Content is required"),
    }),
    defineField({
      name: "image",
      type: "url",
      title: "Header Image URL",
      description: "Direct URL to the post image (optional)",
    }),
    defineField({
      name: "views",
      type: "number",
      title: "Views",
      description: "Number of times this post has been viewed",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "comments",
      type: "array",
      title: "Comments",
      of: [{ type: "reference", to: [{ type: "comment" }] }],
    }),
    defineField({
      name: "likes",
      type: "array",
      title: "Likes",
      of: [{ type: "reference", to: [{ type: "author" }] }],
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      title: "Date Created",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
});
