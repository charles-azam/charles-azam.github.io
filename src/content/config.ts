import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    title_fr: z.string().optional(),
    date: z.string(),
    description: z.string(),
    description_fr: z.string().optional(),
  }),
})

export const collections = { blog }
