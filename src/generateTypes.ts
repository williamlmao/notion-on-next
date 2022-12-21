#! /usr/bin/env node
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import fs from "fs";
import { getDatabase } from "../src/getFromNotion";
import { configInterface } from "../types/types";
import { createFolderIfDoesNotExist } from "./utils";

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
  console.log("Initialized notion-on-next.types.ts");
};

export const generateTypesFromDatabase = async (
  path: string,
  database: GetDatabaseResponse
) => {
  // @ts-ignore -- Notion API types are not consistent with the actual API
  const databaseName = database.title[0].plain_text.replace(/[^a-z0-9]/gi, "");
  const databaseProperties = database.properties;

  // If you need to add a new property type, add it here. https://github.com/makenotion/notion-sdk-js/blob/main/src/api-endpoints.ts for reference.
  const propertyTypeMap = {
    number: "NumberPropertyItemObjectResponse",
    url: "UrlPropertyItemObjectResponse",
    select: "SelectPropertyItemObjectResponse",
    multi_select: "MultiSelectPropertyItemObjectResponse",
    status: "StatusPropertyItemObjectResponse",
    date: "DatePropertyItemObjectResponse",
    email: "EmailPropertyItemObjectResponse",
    phone_number: "PhoneNumberPropertyItemObjectResponse",
    checkbox: "CheckboxPropertyItemObjectResponse",
    file: "FilesPropertyItemObjectResponse",
    created_by: "CreatedByPropertyItemObjectResponse",
    created_time: "CreatedTimePropertyItemObjectResponse",
    last_edited_time: "LastEditedByPropertyItemObjectResponse",
    last_edited_by: "LastEditedTimePropertyItemObjectResponse",
    formula: "FormulaPropertyItemObjectResponse",
    title: "TitlePropertyItemObjectResponse",
    rich_text: "RichTextPropertyItemObjectResponse",
    people: "PeoplePropertyItemObjectResponse",
    relation: "RelationPropertyItemObjectResponse",
    rollup: "RollupPropertyItemObjectResponse",
  };
  const allBlockTypesFromResponse = Object.keys(databaseProperties).map(
    (key) => {
      const property = databaseProperties[key];
      return property.type;
    }
  );
  const uniqueBlockTypesFromDatabase = Array.from(
    new Set(allBlockTypesFromResponse)
  );

  const allBlockTypeImports = uniqueBlockTypesFromDatabase
    .map((type) => propertyTypeMap[type as keyof typeof propertyTypeMap])
    .filter(Boolean); // filter out undefined

  await updateImports(path, allBlockTypeImports);
  const typeDefStart = `\nexport type ${databaseName}PageObjectResponse = NotionOnNextPageObjectResponse & {\n\tproperties: {\n`;
  const typeDefEnd = `\n\t}\n}`;
  const typeDefProperties = Object.keys(databaseProperties).map((key) => {
    const property = databaseProperties[key];
    const propertyType = property.type;
    const propertyTypeMapped =
      propertyTypeMap[propertyType as keyof typeof propertyTypeMap];
    return `\t\t'${key}': ${propertyTypeMapped};`;
  });

  const typeDef = typeDefStart + typeDefProperties.join("\n") + typeDefEnd;
  await appendToFile(path, typeDef, () => {
    console.log(
      `Generated a type for your database ${databaseName}: ${database}PageObjectResponse in` +
        path
    );
  });
};

const extractImports = (notionImportString: string) => {
  // Pull out the items from the import statement
  //@ts-ignore
  const items = notionImportString
    .match(/{[^}]*}/g)[0]
    .replace(/[{}]/g, "")
    .replace(/\s/g, "")
    .replace(/,\n/g, "")
    .trim()
    .split(",");
  return items;
};

export const updateImports = (
  filePath: string,
  uniqueBlockTypesFromDatabase: string[]
) => {
  // return a promise
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", function (err, contents) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      const notionImportString = contents.match(
        /import\s*{[^}]*}\s*from\s*["']@notionhq\/client\/build\/src\/api-endpoints["']/g
      )?.[0];
      if (!notionImportString) {
        console.log("Could not find notion import string");
        return;
      }
      const currentImportedNotionTypes = extractImports(notionImportString);
      const combinedTypeImports = Array.from(
        new Set([
          ...currentImportedNotionTypes,
          ...uniqueBlockTypesFromDatabase,
          "PageObjectResponse",
        ])
      );
      // Filter out dupes
      const uniqueCombinedTypeImports = Array.from(
        new Set(combinedTypeImports)
      ).filter(Boolean);

      const updatedNotionImports = `import { ${uniqueCombinedTypeImports.join(
        ", "
      )} } from "@notionhq/client/build/src/api-endpoints";`;

      const updatedContents = contents.replace(
        notionImportString,
        updatedNotionImports
      );
      fs.writeFile(filePath, updatedContents, "utf-8", function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(
          "Updated imports statement in ",
          filePath,
          " with ",
          uniqueCombinedTypeImports.join(", ")
        );
        resolve("done");
      });
    });
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
