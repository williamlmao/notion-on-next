# Table of Contents <!-- omit in toc -->

- [About](#about)
  - [Features](#features)
  - [Who is notion-on-next for?](#who-is-notion-on-next-for)
- [Installation](#installation)
- [Usage](#usage)
  - [Fetching Data](#fetching-data)
  - [Working with Media](#working-with-media)
  - [Commands](#commands)
  - [Supported Blocks](#supported-blocks)
- [Reference](#reference)
  - [Data fetchers](#data-fetchers)
  - [Components](#components)
- [Why is this library only compatible Next? Why not make it a broader React library?](#why-is-this-library-only-compatible-next-why-not-make-it-a-broader-react-library)
- [Contributing](#contributing)

# About

Notion-on-next makes it really easy to build a Nextjs app that uses Notion as a CMS.

> **WARNING**
> This repo uses experimental Next 13 features in /components. Use at your own risk. Type generation, data fetchers, and downloading media are all compatible with Next 12/React.

## Features

- Automatically generates types that match your database properties
- Provides components to render your Notion Pages
- Provides data fetching functions that add some utility to the [notion-sdk](https://github.com/makenotion/notion-sdk-js)
- Downloads all of the media from your database into your public folder, [to get around Notion API's 1 hr media expiration](https://developers.notion.com/docs/working-with-files-and-media#retrieving-files-and-media-via-the-notion-api)
- Scaffolds out all of the necessary components for /app/[yourdatabase]. You can get a working app up and running in 5 minutes!

## Who is notion-on-next for?

It's for Next.js developers who want to use Notion as a CMS. You should have an understanding of the Next 13 app directory and data fetching patterns. This library gives you a solid foundation to build on top of, but if you are looking for an out-of-the-box solution, I recommend checking out [nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit).

# Installation

1. Create a fresh Next app with `npx create-next-app@latest --experimental-app`
2. Install notion-on next: `npm i notion-on-next`
3. [Create a Notion integration.](https://www.notion.so/help/create-integrations-with-the-notion-api#create-an-internal-integration)
4. In Notion, share your database with your newly created integration.
5. Get [your internal integration token](https://www.notion.so/my-integrations), and add it to a .env file in the root directory as `NOTION_KEY=yourtoken`
6. Run `npx non setup`. Make sure to hit yes when prompted to download media and scaffold the app directory. Typescript is recommended.
7. You’re ready to go! Run npm run dev and then visit http://localhost:3000/yourdatabasename to see your content.
8. You might notice that your app is slow in development mode. This is because it needs to refetch your data from Notion whenever you refresh or go to a new page. To try out the production build, run npm run build and then npm run start.

# Usage

## Fetching Data

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

If you are using `<NotionPageBody>`, you can `import "notion-on-next/styles.css"` for styling in either in your `layout.tsx` or `page.tsx` depending on which version of Next you are using. Alternatively, you can [copy the file](https://github.com/williamlmao/notion-on-next/blob/main/styles.css) and change the styling to suit your preferences.

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

## Working with Media

> **INFO**  
> [Media from the official Notion API expires every hour](https://developers.notion.com/docs/working-with-files-and-media).

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

## Commands

- `npx non setup`
  - Generates a `notion-on-next.config.js` file in the root of your project.
  - Generates `notion-on-next.types.ts` that includes all of your database types in whichever folder you specify.
  - Downloads all media in specified databases into `/public/notion-media`.
- `npx non media`
  - Downloads media from every database specified in `notion-on-next.config.js` into `/public/notion-media.
  - Run this command again if you added new media or if you see broken images on your site.
- `npx non types`
  - Generates your types based on the databases specified in `notion-on-next.config.js`. If you want to change the file path.
  - Run this command again if you update any database properties.

## Supported Blocks

You can see all of the supported blocks [here](https://notion-on-next-starter.vercel.app/programming/Notion-on-next-Supported-Blocks-Examples). Please submit an issue if there is a block that you would like to see supported.

# Reference

## Data fetchers

| Name           | Description                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| getDatabase    | Fetches a database, raw API                                                                            |
| getPages       | Fetches a page, raw API                                                                                |
| getParsedPages | Fetches a page but exposes title, coverImage, and slug. Allows you to pass in a database-specific type |
| getBlocks      | Fetches all blocks in a page, raw                                                                      |

## Components

| Name             | Description                                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| NotionPageHeader | There is no component called NotionPageHeader exported. It is recommended to write your own, as every database will have different properties. |
| NotionPageBody   | A container for all of a page's blocks.                                                                                                        |
| Block            | Renders a Notion block and child blocks.                                                                                                       |
| RichText         | Renders rich text.                                                                                                                             |

# Why is this library only compatible Next? Why not make it a broader React library?

The honest answer is because this started out with me wanting to play with Next 13 and React experimental features. I used a lot of those features and patterns in this library. However, this could be refactored to work for vanilla React. If you're interested in that, let me know. With enough interest I may re-write the library.

# Contributing

This is one of my first npm packages, so I am very open to any contributions or feedback! Please feel free to open an issue or PR.
