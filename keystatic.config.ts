import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: "cloud",
  },
  cloud: {
    project: 'dc392/personal-blog',
  },
  collections: {
    tags: collection({
      label: "Tags",
      slugField: "name",
      path: "src/content/tags/*",
      format: { contentField: "description" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        description: fields.document({
          label: "Description",
          formatting: true,
          links: true
        })
      }
    }),
    series: collection({
      label: "Series",
      slugField: "title",
      path: "src/content/series/*",
      format: { contentField: "description" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.document({
          label: "Description",
          formatting: true,
          links: true
        }),
        posts: fields.array(
          fields.object({
            subtitle: fields.text({
              label: "Subtitle"
            }),
            post: fields.relationship({
              label: "Post",
              collection: "posts"
            })
          }),
          {
            label: "Posts",
            itemLabel: (props) => `${props.fields.subtitle.value}: ${props.fields.post.value}`
          }
        )
      }
    }),
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
        publishDate: fields.date({
          label: "Publish Date"
        }),
        tags: fields.array(
          fields.relationship({
            label: "Tags",
            collection: "tags",
          }),
          {
            label: "Tags",
            itemLabel: props => props.value ?? "Select tags"
          }
        )
      },
    }),
  },
});