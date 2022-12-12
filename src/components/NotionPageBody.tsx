import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import { asyncComponent, mediaMapInterface } from "../../types/types";
import { Block } from "./Block";

/**
 * Renders your notion page content. It does not include the page title or other page properties.
 * * @param mediaMap is an object that notion-on-next generates for you. Find it in public/notion-media/media-map.json.
 */
export const NotionPageBody = asyncComponent(
  async ({
    blocks,
    databaseId,
    pageId,
    mediaMap,
  }: {
    blocks: (PartialBlockObjectResponse | BlockObjectResponse)[];
    databaseId: string;
    pageId: string;
    mediaMap?: mediaMapInterface;
  }) => {
    return (
      <div className="notion_page_body">
        {blocks.map((block) => {
          if (block) {
            return (
              <Block
                block={block}
                databaseId={databaseId}
                pageId={pageId}
                key={block.id}
                blocks={blocks}
                mediaMap={mediaMap}
              />
            );
          } else {
            // Prevents undefined block error
            return <></>;
          }
        })}
      </div>
    );
  }
);
