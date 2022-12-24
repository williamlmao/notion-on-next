// @ts-nocheck
import "notion-on-next/styles.css";
import { cachedGetParsedPages } from "../get";
import { DATABASENAMEPASCALCard } from "./DATABASENAMEPASCALCard";
const databaseId = "DATABASEID";

export default async function DATABASENAMEPASCALBlog() {
  const pages = await cachedGetParsedPages(databaseId);
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
