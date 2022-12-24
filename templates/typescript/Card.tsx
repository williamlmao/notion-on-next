// @ts-nocheck
import Link from "next/link";
import Image from "next/image";
import _mediaMap from "../../public/notion-media/media-map.json";
import { mediaMapInterface } from "notion-on-next/types/types";
import { DATABASENAMEPASCALPageObjectResponse } from "../../types/notion-on-next.types";
const mediaMap: mediaMapInterface = _mediaMap;

// The reason why this Card component is specific to a database is because notion-on-next cannot know what properties are in your database. You may want different cards for different databases.
// It is up to you to complete this component by creating components for your database properties.

export const DATABASENAMEPASCALCard = ({
  page,
  databaseId,
}: {
  page: DATABASENAMEPASCALPageObjectResponse;
  databaseId: string;
}) => {
  return (
    <Link
      href={`/DATABASENAMESPINAL/${page.slug}`}
      key={page.id}
      style={{
        width: "100%",
        boxShadow: "0 0 8px 0 rgba(0, 0, 0, 0.1)",
        padding: "16px",
        borderRadius: "8px",
      }}
    >
      <div>
        <div>
          <Image
            alt={page.title || "Cover Image for " + page.id}
            src={mediaMap[databaseId]?.[page.id]?.cover}
            width={800}
            height={800}
          />
        </div>
        <div>
          <div
            style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}
          >
            {page.title}
          </div>
          <div>{new Date(page.created_time).toLocaleDateString()}</div>
        </div>
      </div>
    </Link>
  );
};
