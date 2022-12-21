import { Client, collectPaginatedAPI, isFullPage } from "@notionhq/client";
import {
  GetDatabaseResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

export const notion = new Client({ auth: process.env.NOTION_KEY });

export const getDatabase = async (
  databaseId: string
): Promise<GetDatabaseResponse | undefined> => {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    return response;
  } catch (e) {
    console.error(
      "Error: The database ID you provided is invalid. Please double check that you have set up the Notion API integration with the database, and that you are providing the right database IDs."
    );
    return undefined;
  }
};

/**
 * This function pulls out the required types for notion-on-next: slug, title, and cover image to make these properties more accessible.
 * It also accepts a generic type which is meant to be passed down from getParsedPages, but can be used elsewhere.
 */
export const parsePages = async <Type>(
  pages: (PageObjectResponse | PartialPageObjectResponse)[],
  database?: GetDatabaseResponse
): Promise<Type[]> => {
  const parsedPages = pages.map((page) => {
    if (!isFullPage(page)) {
      return page;
    }
    const slug = page.url
      .split("/")
      .slice(3)
      .join("/")
      .split("-")
      .slice(0, -1)
      .join("-");
    // Working around type errors: https://github.com/makenotion/notion-sdk-js/issues/154
    const nameProp = page.properties.Name;
    let title;
    if (nameProp?.type === "title") {
      title = nameProp?.title[0]?.plain_text;
    }
    return {
      ...page,
      slug: slug,
      title: title,
      // @ts-ignore -- Notion API types are not consistent with the actual API
      // lower case, replace spaces with hyphens, and remove any special characters
      databaseName: database?.title[0]?.plain_text
        .trim()
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase(),
      databaseId: database?.id,
      coverImage:
        page?.cover?.type === "file"
          ? page?.cover?.file?.url
          : page?.cover?.external?.url,
    };
  });
  return parsedPages as unknown as Type[];
};

/**
 * This is a cached function that fetches all pages from a Notion database.
 */
export const getPages = async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId as string,
  });
  return response.results;
};

/**
 * Gets all pages from a Notion database and parses them into a more usable format.
 * Accepts a generic type, which is generated for you after running setup in notion-on-next.
 * The generic type should be a version of PageObjectResponse, but with your database's properties.
 */
export const getParsedPages = async <Type>(databaseId: string) => {
  const pages = await getPages(databaseId);
  const database = await getDatabase(databaseId);
  const parsedPages = await parsePages<Type>(pages, database);
  return parsedPages;
};

export const getBlocks = async (pageId: string) => {
  const blocks = await collectPaginatedAPI(notion.blocks.children.list, {
    block_id: pageId,
  });
  return blocks;
};
