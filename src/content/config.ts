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

const homepageSectionsCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        references: z.discriminatedUnion("discriminant", [
            z.object({ discriminant: z.literal("none") }),
            z.object({ discriminant: z.literal("posts"), value: z.array(reference("posts")) }),
            z.object({ discriminant: z.literal("tags"), value: z.array(reference("tags")) }),
            z.object({ discriminant: z.literal("series"), value: z.array(reference("series")) })
        ])
    })
})

const homepage = defineCollection({
    type: "data",
    schema: z.object({
        sections: z.array(reference("homepageSections"))
    })
})

export const collections = {
    posts: postsCollection,
    tags: tagsCollection,
    series: seriesCollection,
    homepageSections: homepageSectionsCollection,

    homepage
}