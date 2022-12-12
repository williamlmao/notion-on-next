#! /usr/bin/env node
import { isFullBlock } from "@notionhq/client";
import fs from "fs";
import request from "request";
import { getBlocks, getPages, parsePages } from "../index";
import {
  configInterface,
  mediaMapInterface,
  NotionOnNextPageObjectResponse,
} from "../types/types";
import { createFolderIfDoesNotExist, getFileExtension } from "./utils";

export const downloadMedia = async () => {
  const configPath = "./notion-on-next.config.json";
  const config = JSON.parse(
    fs.readFileSync(configPath, "utf8")
  ) as configInterface;

  for (const databaseId in config.databases) {
    await fetchImages(databaseId);
  }
};

export async function fetchImages(
  databaseId: string,
  pages?: NotionOnNextPageObjectResponse[],
  update?: boolean
) {
  console.log("FETCHING: ", databaseId);
  // Read media map
  const mediaMapPath = "./public/notion-media/media-map.json";
  // Check if media map exists
  let mediaMap = {} as mediaMapInterface;
  if (fs.existsSync(mediaMapPath)) {
    console.log("mediaMapPath exists: ", databaseId);
    mediaMap = JSON.parse(
      fs.readFileSync(mediaMapPath, "utf8")
    ) as mediaMapInterface;
  }
  const basePath = `./public/notion-media`;
  await createFolderIfDoesNotExist(`${basePath}`);
  const databasePath = `${basePath}/${databaseId}`;
  if (!mediaMap[databaseId]) {
    mediaMap[databaseId] = {};
  }
  await createFolderIfDoesNotExist(`${databasePath}`);
  if (!pages) {
    const unparsedPages = await getPages(databaseId);
    pages = await parsePages(unparsedPages);
  }
  for (const page of pages) {
    const mediaMapDb = mediaMap[databaseId];
    const pageId = page.id;
    if (!mediaMapDb[pageId]) {
      mediaMapDb[pageId] = {};
    }
    const pageFolderPath = `${databasePath}/${pageId}`;
    await createFolderIfDoesNotExist(`${pageFolderPath}`);
    // Download cover images
    if (page.coverImage) {
      // Regex to get the file extension from the URL (e.g. png, jpg, jpeg, etc)
      const fileExtension = getFileExtension(page.coverImage);
      const coverImagePath = `${pageFolderPath}/cover.${fileExtension}`;
      // Remove /public from the mediamap path so it can be used in the Next App (you don't need to include /public in the paths)
      const coverImagePathWithoutPublic = `/notion-media/${databaseId}/${pageId}/cover.${fileExtension}`;
      // @ts-ignore -- TODO: Fix this type error
      mediaMap[databaseId][pageId].cover = coverImagePathWithoutPublic;

      await downloadMediaToFolder(
        page.coverImage,
        coverImagePath,
        () => {
          console.log(
            `Downloaded cover image for ${page.title} (id:${pageId}) in database: ${databaseId}`
          );
        },
        update
      );
    }
    // Download all blocks and their images
    const blocks = await getBlocks(pageId);
    for (const block of blocks) {
      const blockId = block.id;
      if (!isFullBlock(block)) {
        continue;
      }
      let url;
      if (block.type === "image") {
        const image = block.image;
        url = image.type === "external" ? image.external.url : image.file.url;
      }

      if (block.type === "video") {
        const video = block.video;
        url = video.type === "external" ? video.external.url : video.file.url;
      }
      if (!url) {
        continue;
      }
      const fileExtension = getFileExtension(url);
      const blockImagePath = `${pageFolderPath}/${blockId}.${fileExtension}`;
      const blockImagePathWithoutPublic = `/notion-media/${databaseId}/${pageId}/${blockId}.${fileExtension}`;

      mediaMap[databaseId][pageId][blockId] = blockImagePathWithoutPublic;
      downloadMediaToFolder(
        url,
        blockImagePath,
        () => {
          `Downloaded image for blockId: ${block.id} in ${page.title} (id:${pageId}) in databaseId: ${databaseId}`;
        },
        update
      );
    }
  }
  // // Write the image map to a .json file
  fs.writeFileSync(`${basePath}/media-map.json`, JSON.stringify(mediaMap));
}

export const downloadMediaToFolder = async (
  url: string,
  path: string,
  callback: () => void,
  update?: boolean
) => {
  if (fs.existsSync(path) && !update) {
    console.log(`File already exists at ${path}, skipping download`);
    callback();
    return;
  }
  // overwrite if file already exists
  await request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};
