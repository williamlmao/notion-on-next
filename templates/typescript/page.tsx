// @ts-nocheck
import { DATABASENAMEPASCALPageObjectResponse } from "../../types/notion-on-next.types";
import { cachedGetParsedPages } from "../get";
import { DATABASENAMEPASCALCard } from "./DATABASENAMEPASCALCard";
import "notion-on-next/styles.css";
const databaseId = "DATABASEID";

export default async function DATABASENAMEPASCALBlog() {
  const pages =
    await cachedGetParsedPages<DATABASENAMEPASCALPageObjectResponse>(
      databaseId
    );
  return (
    <div style={{ padding: "24px", margin: "auto" }}>
      <h1 style={{ fontSize: "36px", textAlign: "center" }}>
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
