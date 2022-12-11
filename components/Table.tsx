import { TableBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import { getBlocks } from "../src/getFromNotion";
import { asyncComponent } from "../types/types";
import { RichText } from "./RichText";
export const Table = asyncComponent(
  async ({ block }: { block: TableBlockObjectResponse }) => {
    const children = await getBlocks(block.id);
    const has_column_header = block.table.has_column_header;
    const has_row_header = block.table.has_row_header;
    return (
      <table className="notion_table">
        <tbody>
          {children?.map((row, i) => {
            if (row) {
              return (
                <tr
                  key={row.id}
                  className={
                    has_column_header && i === 0 ? "notion_table_header" : ""
                  }
                >
                  {/* @ts-ignore */}
                  {row.table_row.cells.map((cell, j) => {
                    if (cell) {
                      console.log("cell", cell);
                      return (
                        <td
                          key={cell.id}
                          className={`notion_table_cell ${
                            has_row_header && i === 0
                              ? "notion_table_header"
                              : ""
                          }`}
                        >
                          <RichText rich_text={cell} />
                        </td>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </tr>
              );
            } else {
              return <></>;
            }
          })}
        </tbody>
      </table>
    );
  }
);
