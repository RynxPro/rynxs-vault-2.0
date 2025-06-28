import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `false` if you want to ensure fresh data
  // Use a viewer token for read operations if available, otherwise use the main token
  token: process.env.SANITY_VIEWER_TOKEN || process.env.SANITY_API_TOKEN,
});
