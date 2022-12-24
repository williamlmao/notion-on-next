// @ts-nocheck
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { getBlocks, getParsedPages } from "notion-on-next";
import { cache } from "react";

export const cachedGetParsedPages = cache(
  async <Type>(pageId: string): Promise<Type[]> => {
    const pages: Type[] = await getParsedPages(pageId);
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
