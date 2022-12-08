#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var setup_1 = require("./setup");
var generateTypes_1 = require("./generateTypes");
var downloadMedia_1 = require("./downloadMedia");
var command = process.argv[2];
switch (command) {
    case "setup":
        (0, setup_1.setup)();
        break;
    case "media":
        (0, downloadMedia_1.downloadMedia)();
        break;
    case "types":
        (0, generateTypes_1.generateTypes)();
        break;
    default: {
        console.log("Please use one of the following commands: setup, media, types. Example: npx-non setup");
    }
}
