// @ts-nocheck
import { notFound } from "next/navigation";
import { mediaMapInterface, NotionPageBody } from "notion-on-next";
import React from "react";
import _mediaMap from "../../../public/notion-media/media-map.json";
import { DATABASENAMEPASCALPageObjectResponse } from "../../../types/notion-on-next.types";
import { cachedGetBlocks, cachedGetParsedPages } from "../../get";
import Image from "next/image";
import { NotionOnNextPageObjectResponse } from "notion-on-next/types/types";

const mediaMap: mediaMapInterface = _mediaMap;
interface PageProps {
  slug: string;
}
const databaseId = "DATABASEID";

export default async function BlogPage({
  params,
}: {
  params: PageProps;
}): Promise<React.ReactNode> {
  const { slug } = params;
  // This may seem like a roundabout way to retrieve the page, but getParsedPages is a per-request cached function. You can read more about it here https://beta.nextjs.org/docs/data-fetching/caching#preload-pattern-with-cache
  // The reason why we have to get all of the pages and then filter is because the Notion API can only search for pages via page id and not slug.
  const pages =
    await cachedGetParsedPages<DATABASENAMEPASCALPageObjectResponse>(
      databaseId
    );
  const page = pages.find(
    (page: NotionOnNextPageObjectResponse) => page.slug === slug
  );
  if (!page) {
    notFound();
  }
  const blocks = await cachedGetBlocks(page.id);

  return (
    <div>
      <div>
        <Image
          src={mediaMap[databaseId][page.id].cover}
          alt={page.title || "DATABASENAMEPASCAL Post"}
          width={500}
          height={500}
        />

        <div>
          <div>{page.title}</div>
          <div>{new Date(page.created_time).toLocaleDateString()}</div>
        </div>
      </div>
      <hr />
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
  const pages =
    await cachedGetParsedPages<DATABASENAMEPASCALPageObjectResponse>(
      databaseId
    );
  return pages.map((page: NotionOnNextPageObjectResponse) => ({
    slug: page.slug,
  }));
}
