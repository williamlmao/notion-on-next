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
export const getPages = async (databaseId: string, filters?: PagesFilters) => {
  const response = await notion.databases.query({
    database_id: databaseId as string,
  });
  const pages = response.results;

  if (!filters) {
    return pages;
  }

  const filteredPages = pages.filter((page) => {
    if (!isFullPage(page)) {
      return false;
    }

    const filterEntries = Object.entries(filters);
    let pass = true;
    filterEntries.forEach(([key, filter]) => {
      switch (filter.type) {
        case "checkbox":
          if (page.properties[key].type === "checkbox") {
            // @ts-ignore
            if (page.properties[key].checkbox !== filter.value) {
              pass = false;
            }
          }
          break;
        // case "multi_select":
        //   if (page.properties[key].type === "multi_select") {
        //     // @ts-ignore
        //     const pageOptions = page.properties[key].multi_select.map(
        //       (option) => option.name
        //     );
        //     const filterOptions = filter.value;
        //     filterOptions.forEach((filterOption) => {
        //       if (!pageOptions.includes(filterOption)) {
        //         pass = false;
        //       }
        //     });
        //   }
        //   break;
        // case "select":
        //   if (page.properties[key].type === "select") {
        //     // @ts-ignore
        //     if (page.properties[key].select.name !== filter.value) {
        //       pass = false;
        //     }
        //   }
        //   break;
        // case "text":
        //   if (page.properties[key].type === "rich_text") {
        //     // @ts-ignore
        //     const pageText = page.properties[key].rich_text[0].plain_text;
        //     const filterText = filter.value;
        //     if (!pageText.includes(filterText)) {
        //       pass = false;
        //     }
        //   }
        //   break;
        // case "date":
        //   if (page.properties[key].type === "date") {
        //     // @ts-ignore
        //     const pageDate = page.properties[key].date.start;
        //     const filterDate = filter.value;
        //     if (pageDate !== filterDate) {
        //       pass = false;
        //     }
        //   }
        //   break;
        // case "number":
        //   if (page.properties[key].type === "number") {
        //     // @ts-ignore
        //     const pageNumber = page.properties[key].number;
        //     const filterNumber = filter.value;
        //     if (pageNumber !== filterNumber) {
        //       pass = false;
        //     }
        //   }
        //   break;
        // case "people":
        //   if (page.properties[key].type === "people") {
        //     // @ts-ignore
        //     const pagePeople = page.properties[key].people;
        //     const filterPeople = filter.value;
        //     if (pagePeople !== filterPeople) {
        //       pass = false;
        //     }
        //   }
        //   break;
        // case "email":
        //   if (page.properties[key].type === "email") {
        //     // @ts-ignore
        //     const pageEmail = page.properties[key].email;
        //     const filter
      }
    });
    return pass;
  });
  return filteredPages;
};

/**
 * Gets all pages from a Notion database and parses them into a more usable format.
 * Accepts a generic type, which is generated for you after running setup in notion-on-next.
 * The generic type should be a version of PageObjectResponse, but with your database's properties.
 */
export const getParsedPages = async <Type>(
  databaseId: string,
  filters?: PagesFilters
) => {
  const pages = await getPages(databaseId, filters);
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
