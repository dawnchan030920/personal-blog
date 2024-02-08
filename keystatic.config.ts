import { config, fields, collection, singleton } from '@keystatic/core';

const prod = import.meta.env.PROD;

export default config({
  storage: prod ? {
    kind: "cloud",
  } : {
    kind: "local"
  },
  cloud: prod ? {
    project: 'dc392/personal-blog',
  } : undefined,
  singletons: {
    homepage: singleton({
      label: "Homepage",
      path: "src/content/homepage/",
      schema: {
        sections: fields.array(
          fields.relationship({
            label: "Section",
            collection: "homepageSections"
          }),
          {
            label: "Sections",
            itemLabel: (props) => props.value!
          }
        )
      }
    })
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
    homepageSections: collection({
      label: "Homepage Sections",
      path: "src/content/homepageSections/*",
      format: { contentField: "description" },
      slugField: "title",
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.document({
          label: "Description",
          formatting: true,
          links: true
        }),
        references: fields.conditional(
          fields.select({
            label: "Reference Type",
            options: [
              { label: "Posts", value: "posts" },
              { label: "Tags", value: "tags" },
              { label: "Series", value: "series" },
              { label: "No references", value: "none" }
            ],
            defaultValue: "none"
          }),
          {
            none: fields.empty(),
            posts: fields.array(
              fields.relationship({
                label: "Posts",
                collection: "posts"
              }),
              {
                label: "Posts",
                itemLabel: (props) => props.value!
              }
            ),
            tags: fields.array(
              fields.relationship({
                label: "Tags",
                collection: "tags"
              }),
              {
                label: "Tags",
                itemLabel: (props) => props.value!
              }
            ),
            series: fields.array(
              fields.relationship({
                label: "Series",
                collection: "series"
              }),
              {
                label: "Series",
                itemLabel: (props) => props.value!
              }
            )
          }
        )
      }
    }),
  },
});