import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "../env";

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always false for writing
  token: process.env.SANITY_API_TOKEN, // Must be set in .env.local
});

export default writeClient;
