import { type SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { game } from "./game";
import { post } from "./post";
import { comment } from "./comment";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, game, post, comment],
};
