import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "id",
      type: "number",
    }),
    defineField({
      name: "name",
      type: "string",
    }),
    defineField({
      name: "username",
      type: "string",
    }),
    defineField({
      name: "email",
      type: "string",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      options: {
        hotspot: true, // if you want image focus/crop support
      },
    }),
    defineField({
      name: "bio",
      type: "text",
    }),
    defineField({
      name: "followers",
      title: "Followers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "author" }] }],
      description: "List of authors who follow this author",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
