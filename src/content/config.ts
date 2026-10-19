import { defineCollection, z } from 'astro:content';

const study = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    module: z.string(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  study,
};
