#! /usr/bin/env node
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import fs from "fs";
import { getDatabase } from "../src/getFromNotion";
import { configInterface } from "../types/types";
import { createFolderIfDoesNotExist, pascalCase } from "./utils";

export const generateTypes = async () => {
  // Read users config file
  const configPath = "./notion-on-next.config.json";
  const config = JSON.parse(
    fs.readFileSync(configPath, "utf8")
  ) as configInterface;
  await createFolderIfDoesNotExist(`${config.typesFolderPath}`);
  // Generate types from the user's config file
  await initializeTypes(`${config.typesFolderPath}/notion-on-next.types.ts`);
  for (const databaseId in config.databases) {
    const database = await getDatabase(databaseId);
    if (!database) {
      console.log(
        `Could not find database with id ${databaseId}. Please check your config file.`
      );
      return;
    }
    await generateTypesFromDatabase(
      `${config.typesFolderPath}/notion-on-next.types.ts`,
      database
    );
  }
};

export const initializeTypes = async (path: string) => {
  fs.writeFileSync(
    path,
    `
      import {
        PageObjectResponse,
      } from "@notionhq/client/build/src/api-endpoints";

      export interface NotionOnNextPageObjectResponse extends PageObjectResponse {
        slug: string | undefined;
        title: string | undefined;
        coverImage: string | undefined;
        databaseName: string | undefined;
        databaseId: string | undefined;
      }

      export interface mediaMapInterface {
        [key: string]: {
          [key: string]: {
            [key: string]: string;
          };
        };
      }
    `
  );
  console.log("\n🤖 Initialized notion-on-next.types.ts \n");
};

export const generateTypesFromDatabase = async (
  path: string,
  database: DatabaseObjectResponse
) => {
  const databaseName = pascalCase(database.title[0].plain_text);
  const databaseProperties = database.properties;
  const typeDefStart = `\nexport type ${databaseName}PageObjectResponse = NotionOnNextPageObjectResponse & {\n\tproperties: {\n`;
  const typeDefEnd = `\n\t}\n}`;
  const typeDefProperties = Object.keys(databaseProperties).map((key) => {
    const property = databaseProperties[key];
    const propertyType = property.type;
    return `\t\t'${key}': Extract<PageObjectResponse["properties"][string], { type:"${propertyType}" }>`;
  });

  const typeDef = typeDefStart + typeDefProperties.join("\n") + typeDefEnd;
  await appendToFile(path, typeDef, () => {
    console.log(
      `⌨️ Generated a type for your database ${databaseName}: ${database}PageObjectResponse in` +
        path +
        "\n"
    );
  });
};

export const appendToFile = async (
  filePath: string,
  data: string,
  callback: () => void
) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, data, (err) => {
      if (err) reject(err);
      callback();
      resolve("done");
    });
  });
};
