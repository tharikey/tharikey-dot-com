import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  // Technical docs, rendered by Starlight at /docs. Content under src/content/docs/{engine,macos,fonts}
  // is CI-synced from each component repo's /docs (gitignored — see scripts/sync-docs.mjs).
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),

  // The lean in-repo blog. Markdown posts authored here; rendered at /news.
  news: defineCollection({
    loader: glob({ base: './src/content/news', pattern: '**/*.{md,mdx}' }),
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string(),
      draft: z.boolean().default(false),
    }),
  }),

  // User-facing guides — setup help and articles on niche Thaana-typing topics. A content
  // collection (like news) so guides are easy to author and open to outside contributions.
  guides: defineCollection({
    loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      category: z.string().default('Guides'),
      order: z.number().default(100), // lower sorts first within a category
      draft: z.boolean().default(false),
    }),
  }),
};
