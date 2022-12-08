## Table of Contents <!-- omit in toc -->

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Basic usage in Next.js](#basic-usage-in-nextjs)
- [Working with Media](#working-with-media)
- [Why is this library only compatible Next? Why not make it a broader React library?](#why-is-this-library-only-compatible-next-why-not-make-it-a-broader-react-library)
- [React/Next Experimental Feature Documentation](#reactnext-experimental-feature-documentation)

---

## About

Using Notion as a CMS and Next to generate static sites is a match made in heaven. You end up with:

- The ability to use the Notion's lovely editor to create and store content.
- Blazing fast speeds.
- ISR allows you to update your site frequently without having to redeploy, while maintaining the speed of static pages.

I had played around with a couple other Notion + React libraries, such as [react-notion-x](https://github.com/NotionX/react-notion-x) and [react-notion](https://github.com/splitbee/react-notion). However, I wanted to use the official Notion API, take a different approach with fetching/rendering data, and also make working with typescript easier.

---

## Features

- Automatically generates types based on your Notion database properties.
- Provides React components to render your Notion Pages, but also makes it easy to fetch your Notion data and build your own custom components.
- Downloads all of the media from your database into your public folder, to get around Notion API's 1 hr media expiration.

---

## Installation

- `npm i notion-on-next`
- Make sure your Notion Databases have a connection setup
- Add NOTION_KEY=yoursecret to your .env
- `npx non setup`

Your types will be automatically generated based on your database properties, and all of the media will be downloaded to your public folder.

---

## Basic usage in Next.js

Use `getParsedPages` to retrieve all pages in a database. If you're using typescript, this function also accepts a generic type, which was generated for you inside of notion-on-next.types.ts during setup. This type uses the title of your database in Notion. If your database was titled "Blog", you would use `getParsedPages<BlogPageObjectResponse>(databaseId)`.

```
// Next 13 - /app/blog
export default async function Blog() {
  const pages = await getParsedPages<BlogPageObjectResponse>(
    databaseId
  );
  return (
    <div>
      <main>
        <h1>Blog Posts</h1>
        <div>
          {pages.map((page) => (
            <BlogPageCard
              page={page}
              databaseId={databaseId}
              key={page.id}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
```

Then, create a route to load single pages. Notion API refers to data such as the title, cover photos, and properties as a page. To get a page's contents, use `getBlocks(pageId)`. To get the page id in Next 13, you will need to fetch all of your pages and then filter by the slug, as that is the only param you can access if your route is `[slug]`. If you are okay with a pageId in the URL, then you can skip fetching all of the pages and swap `[slug]` for `[pageId]`.

You can either write your own components to display the data, or you can use `<NotionPageBody`> to render the contents of a page.

If you are using `<NotionPageBody>`, you can `import "notion-on-next/non.css"` for styling in either in your `layout.tsx` or `page.tsx` depending on which version of Next you are using. Alternatively, you can [copy the file](https://github.com/williamlmao/notion-on-next/blob/main/non.css) and change the styling to suit your preferences.

> The data fetchers in this library are compatible with Next 12, but NotionPageBody is a server component that is only compatible with Next 13.

```
// /app/blog/[slug]
export default async function BlogPage({
  params,
}: {
  params: PageProps;
}): Promise<React.ReactNode> {

  const { slug } = params;

  // The reason why we have to fetch all of the pages and then filter
  // is because the Notion API can only search for pages
  // via page id and not slug. As of now, there is no way to pass params
  // other than what is contained in the route to a Page component.

  const pages = await getParsedPages<ProgrammingPageObjectResponse>(
    databaseId
  );

  const page = pages.find((page) => page.slug === slug);

  if (!page) {
    notFound();
  }

  const blocks = await getBlocks(page.id);

  return (
    <div>
      <NotionPageBody
        blocks={blocks}
        pageId={page.id}
        databaseId={databaseId}
        mediaMap={mediaMap}
      />
    </div>
  );
}

export async function generateStaticParams() {
  // This generates routes using the slugs created from getParsedPages
  const pages = await getParsedPages<BlogPageObjectResponse>(
    databaseId
  );
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

```

Since we are generating the sites statically, it's not that big of a deal to call `getPages` in multiple places because those calls will only be made at build time. However, if you have a ton of pages and are worried about the volume of requests you are making to the Notion API, you can [use per-request caching](https://beta.nextjs.org/docs/data-fetching/caching#per-request-caching).

To take advantage of per-request caching, import this function in any file you are calling `getParsedPages` and use `cachedGetParsedPages` instead.

```
//utils/cached-data-fetchers.ts
import { getParsedPages } from "notion-on-next";
import { cache } from "react";

export const cachedGetParsedPages = cache(
  async <Type>(pageId: string): Promise<Type[]> => {
    const pages: Type[] = await getParsedPages(pageId);
    return pages;
  }
);
```

---

## Working with Media

[Media from the official Notion API expires every hour](https://developers.notion.com/docs/working-with-files-and-media).

> Since the public URLs expire hourly, they shouldn’t be statically referenced. If the public URL is directly referenced, the file will not be accessible at that URL after the expiration time is reached and a new URL must be retrieved via the Notion API.

To get around this problem, notion-on-next downloads all of the media in your database into `/public/notion-media/databaseId/pageId/blockId`. If your page has a cover photo, it will save that as `cover` inside of the pages folder.

Since we don't know what file extension each image/video will be, there is a file called `media-map.json` that is generated, which contains the URL.

In any component where you are trying to display an image, you can import the mediaMap and then reference the URL like so:

```
import mediaMap from "../../public/notion-media/media-map.json";

// For type safety, you should check in the parent component that the block is of type image
export const ImageCard = ({databaseId, pageId, blockId}) => {
    return <img src={mediaMap[databaseId][pageId][blockId]}>
}
```

---

## Why is this library only compatible Next? Why not make it a broader React library?

The honest answer is because this started out with me wanting to play with Next 13 and React experimental features. I used a lot of those features and patterns in this library. However, this could be refactored to work for vanilla React. If you're interested in that, let me know. With enough interest I may re-write the library.

---

## React/Next Experimental Feature Documentation

https://github.com/acdlite/rfcs/blob/first-class-promises/text/0000-first-class-support-for-promises.md#example-use-in-client-components-and-hooks (to read about cache)
