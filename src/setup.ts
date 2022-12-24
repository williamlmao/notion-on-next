#! /usr/bin/env node

//  This file is the executable file. It is run when you run npx-non
import { generateTypesFromDatabase, initializeTypes } from "./generateTypes";
import { configInterface } from "../types/types";
import { getDatabase } from "../src/getFromNotion";
import { fetchImages } from "../src/downloadMedia";
import { createFolderIfDoesNotExist } from "./utils";
import { scaffoldApp } from "./scaffoldAppDirectory";
import prompt from "prompt";
import fs from "fs";

const typeScript = [
  {
    name: "typescript",
    description: "Would you like to use TypeScript? (y/n)",
    pattern: /y[es]*|n[o]?/,
    default: "yes",
  },
];

const downloadMedia = [
  {
    name: "downloadMedia",
    description:
      "Would you like to download the media from the databases? (y/n)",
    pattern: /y[es]*|n[o]?/,
    default: "yes",
  },
];

const typesDestinationFolderPath = [
  {
    name: "typesFolderPath",
    description:
      "Notion-on-next will generate types for you. By default, it will use ./types as the folder to store them. If you would like to change the destination folder, please enter the path or hit enter to use the default.",
    default: "./types",
    pattern: /^(\.\/)?[a-zA-Z0-9_\-]+$/,
    message: "Please enter a valid path",
  },
];

const collectDbIds = [
  {
    name: "databaseIds",
    description:
      "Please enter the database IDs you would like to set up (comma separated)",
    // Pattern checks for comma separated list of 32 or 28 character alphanumeric strings that may or may not be separated by hyphens such as the two below
    // 12c9bf144f9a429b8fffd63c58694c54, 5b3247dc-63b8-4fd1-b610-5e5a8aabd397
    pattern:
      /^([a-zA-Z0-9]{32}|[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})(,\s?([a-zA-Z0-9]{32}|[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}))*$/,
    message:
      "Please make sure you are entering a comma separated list database IDs, which are 32 alphanumeric characters with hyphens or 28 characters without. ",
  },
];

const scaffoldAppDirectory = [
  {
    name: "scaffoldAppDirectory",
    description:
      "\nWould you like to scaffold the app directory with your databases? WARNING: THIS WILL OVERWRITE YOUR /app/[databasename]. Only recommended if you are starting out with a new build. Still want to scaffold? (y/n)",
    pattern: /y[es]*|n[o]?/,
    message: "Please enter yes or no",
    default: "yes",
  },
];

let configTemplate: configInterface = {
  databases: {},
  typesFolderPath: "./types",
};

interface ResponsesInterface {
  databaseIds: string[];
  typescript: boolean;
  typesFolderPath: string;
  downloadMedia: boolean;
  scaffoldAppDirectory: boolean;
}

export const setup = () => {
  let responses: ResponsesInterface = {
    databaseIds: [],
    typescript: false,
    typesFolderPath: "",
    downloadMedia: true,
    scaffoldAppDirectory: true,
  };

  prompt.start();

  prompt.get(collectDbIds, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    const databaseIds = result.databaseIds as string;
    responses.databaseIds = databaseIds
      .split(",")
      .map((id: string) => id.trim());

    prompt.get(downloadMedia, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      const downloadMedia = result.downloadMedia as string;
      responses.downloadMedia = downloadMedia.toLowerCase().includes("y");
      prompt.get(typeScript, function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        const typescript = result.typescript as string;
        responses.typescript = typescript.toLowerCase().includes("y");
        if (responses.typescript) {
          prompt.get(typesDestinationFolderPath, function (err, result) {
            if (err) {
              console.log(err);
              return;
            }
            const typesFolderPath = result.typesFolderPath as string;
            responses.typesFolderPath = typesFolderPath;
            prompt.get(scaffoldAppDirectory, function (err, result) {
              if (err) {
                console.log(err);
                return;
              }
              const scaffoldAppDirectory =
                result.scaffoldAppDirectory as string;
              responses.scaffoldAppDirectory = scaffoldAppDirectory
                .toLowerCase()
                .includes("y");
              processResponses(responses);
            });
          });
        } else {
          responses.typesFolderPath = "";
          processResponses(responses);
        }
      });
    });
  });
};

const processResponses = async (responses: ResponsesInterface) => {
  let configTemplate: configInterface = {
    databases: {},
    typesFolderPath: "./types",
  };

  if (responses.typescript) {
    const typesFolderPath = responses.typesFolderPath;
    if (!typesFolderPath) {
      console.error("Error: typesFolderPath is null");
    }
    // Check if folder typesFolderPath exists
    if (!fs.existsSync(typesFolderPath)) {
      fs.mkdirSync(typesFolderPath);
      // Create a file in the folder called notion-on-next.types.ts
    }

    await initializeTypes(`${typesFolderPath}/notion-on-next.types.ts`);
  } else {
    configTemplate.typesFolderPath = null;
  }

  for (let id of responses.databaseIds) {
    const database = await getDatabase(id);
    if (!database) {
      console.log(`Database ${id} not found`);
      return;
    }
    // If the id is unhypenated, then add the hyphens in this pattern 1a67ddff-a029-4cdc-b860-beb64cce9c77
    if (id.length === 32) {
      id = `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(
        16,
        20
      )}-${id.slice(20)}`;
    }

    configTemplate.databases[id] = {
      id,
      name: database.title[0].plain_text,
    };

    if (responses.typescript) {
      await createFolderIfDoesNotExist(`${responses.typesFolderPath}`);
      generateTypesFromDatabase(
        `${responses.typesFolderPath}/notion-on-next.types.ts`,
        database
      );
    }

    if (responses.downloadMedia) {
      await fetchImages(database.id);
    }

    if (responses.scaffoldAppDirectory) {
      scaffoldApp(database);
    }
  }

  fs.writeFileSync(
    "./notion-on-next.config.json",
    JSON.stringify(configTemplate)
  );
  // If typescript or downloadMedia is true, then make requests for the databases
  // https://liuwill.notion.site/notion-on-next-3b6292c8a6fe4dbaa12f9af26cffe674
};
