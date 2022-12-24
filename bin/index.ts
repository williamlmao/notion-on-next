#! /usr/bin/env node
import { setup } from "../src/setup";
import { generateTypes } from "../src/generateTypes";
import { downloadMedia } from "../src/downloadMedia";
import { checkNextVersionNumber } from "../src/utils";

const command = process.argv[2];

switch (command) {
  case "setup":
    // Check if user is using next 13 or greater from package.json
    const nextVersionCompatible = checkNextVersionNumber(13);
    if (!nextVersionCompatible) {
      console.log(
        "Next.js version must be 13 or greater. Please upgrade your Next.js version."
      );
      break;
    }
    setup();
    break;
  case "media":
    downloadMedia();
    break;
  case "types":
    generateTypes();
    break;
  default: {
    console.log(
      "Please use one of the following commands: setup, media, types. Example: npx-non setup"
    );
  }
}
