import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts");
  return rss({
    title: "Dawn Chan's Blog",
    description: "We're all dreamers. We're all writers.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      link: `/posts/${post.slug}`,
    })),
  });
}
