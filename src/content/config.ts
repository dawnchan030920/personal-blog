import { z, defineCollection, reference } from "astro:content";

const postsCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        publishDate: z.coerce.date(),
        tags: z.array(reference("tags"))
    })
})

const tagsCollection = defineCollection({
    type: "content",
    schema: z.object({
        name: z.string(),
    })
})

const seriesCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        posts: z.array(z.object({
            subtitle: z.string(),
            post: reference("posts")
        }))
    })
})

export const collections = {
    posts: postsCollection,
    tags: tagsCollection,
    series: seriesCollection
}