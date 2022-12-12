#! /usr/bin/env node

//  This file is the executable file. It is run when you run npx-non
import { generateTypesFromDatabase, initializeTypes } from "./generateTypes";
import { configInterface } from "../types/types";
import { getDatabase } from "../src/getFromNotion";
import { fetchImages } from "../src/downloadMedia";
import { createFolderIfDoesNotExist } from "./utils";

// @ts-ignore
const prompt = require("prompt");
const fs = require("fs");

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
    type: "string",
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

let configTemplate: configInterface = {
  databases: {},
  typesFolderPath: "./types",
};

interface ResponsesInterface {
  databaseIds: string[];
  typescript: boolean;
  typesFolderPath: string | null;
  downloadMedia: boolean;
}

export const setup = () => {
  let responses: ResponsesInterface = {
    databaseIds: [],
    typescript: false,
    typesFolderPath: "",
    downloadMedia: true,
  };
  // @ts-ignore
  prompt.start();
  // What databases would you like to use?
  // Would you like to download the media from the databases?
  // Do you want to use TypeScript? (y/n)
  // Yes - where do you want to store the types?
  // @ts-ignore
  prompt.get(collectDbIds, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    responses.databaseIds = result.databaseIds
      .split(",")
      .map((id: string) => id.trim());
    // @ts-ignore
    prompt.get(downloadMedia, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      responses.downloadMedia = result.downloadMedia
        .toLowerCase()
        .includes("y");
      // @ts-ignore
      prompt.get(typeScript, function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        responses.typescript = result.typescript.toLowerCase().includes("y");
        if (responses.typescript) {
          // @ts-ignore
          prompt.get(typesDestinationFolderPath, function (err, result) {
            if (err) {
              console.log(err);
              return;
            }
            responses.typesFolderPath = result.typesFolderPath;
            processResponses(responses);
          });
        } else {
          responses.typesFolderPath = null;
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
    // Check if folder typesFolderPath exists
    if (!fs.existsSync(typesFolderPath)) {
      fs.mkdirSync(typesFolderPath);
      // Create a file in the folder called notion-on-next.types.ts
    }

    console.log(
      "Creating types file",
      `${typesFolderPath}/notion-on-next.types.ts`
    );
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
    // Add the database to the config file
    configTemplate.databases[id] = {
      id,
      // @ts-ignore -- Notion API types are not consistent with the actual API
      name: database.title[0].plain_text,
    };
    // If typescript is true, then generate the types
    if (responses.typescript) {
      await createFolderIfDoesNotExist(`${responses.typesFolderPath}`);
      generateTypesFromDatabase(
        `${responses.typesFolderPath}/notion-on-next.types.ts`,
        database
      );
    }
    // If downloadMedia is true, then download the media
    if (responses.downloadMedia) {
      await fetchImages(database.id);
    }
  }

  fs.writeFileSync(
    "./notion-on-next.config.json",
    JSON.stringify(configTemplate)
  );
  // If typescript or downloadMedia is true, then make requests for the databases
};
