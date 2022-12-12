#! /usr/bin/env node
import { setup } from "../src/setup";
import { generateTypes } from "../src/generateTypes";
import { downloadMedia } from "../src/downloadMedia";

const command = process.argv[2];

switch (command) {
  case "setup":
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
