import { type SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { game } from "./game";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, game],
};
