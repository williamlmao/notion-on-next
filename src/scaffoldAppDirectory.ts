import {
  DatabaseObjectResponse,
  GetDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import fs from "fs";
import { getDatabase } from "./getFromNotion";

export const scaffoldApp = async (
  database: DatabaseObjectResponse | string,
  language = "typescript"
) => {
  if (typeof database === "string") {
    const res = await getDatabase(database);
    if (res) {
      database = res;
    }
  }
  database = database as DatabaseObjectResponse;
  // Check if package.json contains next 13 or greater
  const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
  const nextVersion = packageJson.dependencies.next;
  if (nextVersion.split(".")[0] < 13) {
    console.log(
      "Next.js version must be 13 or greater. Please upgrade your Next.js version."
    );
    return;
  }

  const databaseName = database?.title[0]?.plain_text;
  const databaseId = database.id;
  const databaseNameSpinalCase = databaseName
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
  // PascalCaseDatabaseName
  const databaseNamePascalCase = databaseNameSpinalCase
    .split("-")
    .map((word: string) => word[0].toUpperCase() + word.slice(1))
    .join("");

  const databasePath = `./app/${databaseNameSpinalCase}`;
  if (!fs.existsSync(databasePath)) {
    fs.mkdirSync(databasePath);
  }

  const fileExtension = language === "typescript" ? "ts" : "js";

  const pagePath = `${databasePath}/page.tsx`;
  const cardPath = `${databasePath}/${databaseNamePascalCase}Card.tsx`;
  const slugPath = `${databasePath}/[slug]`;
  const slugPagePath = `${databasePath}/[slug]/page.tsx`;
  const getPath = `./app/get.ts`;

  const replaceInPageTemplate = (pageTemplate: string) => {
    return pageTemplate
      .replace(/DATABASENAMEPASCAL/g, databaseNamePascalCase)
      .replace(/DATABASENAMESPINAL/g, databaseNameSpinalCase)
      .replace(/DATABASEID/g, databaseId)
      .replace(/@ts-nocheck/g, "");
  };

  fs.copyFileSync(
    `./node_modules/notion-on-next/templates/${language}/get.${fileExtension}`,
    getPath
  );

  const pageTemplate = fs.readFileSync(
    `./node_modules/notion-on-next/templates/${language}/page.${fileExtension}x`,
    "utf8"
  );
  const pageTemplateReplaced = replaceInPageTemplate(pageTemplate);
  fs.writeFileSync(pagePath, pageTemplateReplaced);

  const cardTemplate = fs.readFileSync(
    `./node_modules/notion-on-next/templates/${language}/Card.${fileExtension}x`,
    "utf8"
  );
  const cardTemplateReplaced = replaceInPageTemplate(cardTemplate);

  fs.writeFileSync(cardPath, cardTemplateReplaced);

  if (!fs.existsSync(slugPagePath)) {
    fs.mkdirSync(slugPath);
  }
  const slugPageTemplate = fs.readFileSync(
    `./node_modules/notion-on-next/templates/${language}/[slug]/page.${fileExtension}x`,
    "utf8"
  );
  const slugPageTemplateReplaced = replaceInPageTemplate(slugPageTemplate);
  fs.writeFileSync(slugPagePath, slugPageTemplateReplaced);
};
