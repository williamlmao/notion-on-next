// @ts-nocheck
import { getBlocks, getParsedPages } from "notion-on-next";
import { cache } from "react";

export const cachedGetParsedPages = cache(async (pageId) => {
  const pages = await getParsedPages(pageId);
  return pages;
});

export const cachedGetBlocks = cache(async (pageId) => {
  const blocks = await getBlocks(pageId);
  return blocks;
});
