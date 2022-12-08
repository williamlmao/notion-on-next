#! /usr/bin/env node
import { setup } from "./setup";
import { generateTypes } from "./generateTypes";
import { downloadMedia } from "./downloadMedia";

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
