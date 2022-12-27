// @ts-nocheck
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getBlocks, getParsedPages } from "notion-on-next";
import { cache } from "react";

// Need to talk to the Notion team about using types for filter and sorts as they are not currently exposed by the SDK, so leaving them as any for now.
export const cachedGetParsedPages = cache(
  async <Type>(pageId: string, filter?: any, sorts?: any): Promise<Type[]> => {
    const pages: Type[] = await getParsedPages(pageId, filter, sorts);
    return pages;
  }
);

export const cachedGetBlocks = cache(
  async (
    pageId: string
  ): Promise<(PartialBlockObjectResponse | BlockObjectResponse)[]> => {
    const blocks = await getBlocks(pageId);
    return blocks;
  }
);
