// @ts-nocheck
import { getBlocks, getParsedPages } from "notion-on-next";
import { cache } from "react";

export const cachedGetParsedPages = cache(async (pageId, filter, sorts) => {
  const pages = await getParsedPages(pageId, filter, sorts);
  return pages;
});

export const cachedGetBlocks = cache(async (pageId) => {
  const blocks = await getBlocks(pageId);
  return blocks;
});
