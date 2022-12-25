// @ts-nocheck
import { DATABASENAMEPASCALPageObjectResponse } from "../../types/notion-on-next.types";
import { cachedGetParsedPages } from "../get";
import { DATABASENAMEPASCALCard } from "./DATABASENAMEPASCALCard";
import "notion-on-next/styles.css";
const databaseId = "DATABASEID";

export default async function DATABASENAMEPASCALBlog() {
  const pages =
    await cachedGetParsedPages<DATABASENAMEPASCALPageObjectResponse>(
      databaseId,
      undefined, // Add filters here: https://developers.notion.com/reference/post-database-query-filter
      [{ timestamp: "last_edited_time", direction: "descending" }] // Add sorts here: https://developers.notion.com/reference/post-database-query-sort
    );
  return (
    <div style={{ padding: "24px", margin: "auto", fontFamily: "sans-serif" }}>
      <h1
        style={{ fontSize: "36px", textAlign: "center", marginBottom: "28px" }}
      >
        DATABASENAMEPASCAL Posts
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
          maxWidth: "800px",
          margin: "auto",
        }}
      >
        {pages.map((page) => (
          <DATABASENAMEPASCALCard
            page={page}
            databaseId={databaseId}
            key={page.id}
          />
        ))}
      </div>
    </div>
  );
}
