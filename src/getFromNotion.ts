import {
  Client,
  collectPaginatedAPI,
  isFullBlock,
  isFullDatabase,
  isFullPage,
} from "@notionhq/client";
import {
  DatabaseObjectResponse,
  GetDatabaseResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { PagesFilters } from "../types/types";
dotenv.config();

export const notion = new Client({ auth: process.env.NOTION_KEY });

export const getDatabase = async (
  databaseId: string
): Promise<DatabaseObjectResponse | undefined> => {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    if (!isFullDatabase(response)) {
      return undefined;
    }
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
  database?: DatabaseObjectResponse
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
export const getPages = async (
  databaseId: string,
  filter?: any,
  sorts?: any
) => {
  type Query = {
    database_id: string;
    filter?: any;
    sorts?: any;
  };
  let query: Query = {
    database_id: databaseId as string,
  };
  if (filter) {
    query = {
      ...query,
      filter: filter,
    };
  }
  if (sorts) {
    query = {
      ...query,
      sorts: sorts,
    };
  }
  const response = await notion.databases.query(query);
  return response.results;
};

/**
 * Gets all pages from a Notion database and parses them into a more usable format.
 * Accepts a generic type, which is generated for you after running setup in notion-on-next.
 * The generic type should be a version of PageObjectResponse, but with your database's properties.
 */
export const getParsedPages = async <Type>(
  databaseId: string,
  // TODO: Talk with notion team about how to get the filter types. They are currently not exported.
  filter: any,
  sorts?: any
) => {
  const pages = await getPages(databaseId, filter, sorts);
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
