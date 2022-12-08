#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
//  This file is the executable file. It is run when you run npx-non
var generateTypes_1 = require("./generateTypes");
var getFromNotion_1 = require("../src/getFromNotion");
var downloadMedia_1 = require("./downloadMedia");
var utils_1 = require("./utils");
// @ts-ignore
var prompt = require("prompt");
var fs = require("fs");
var typeScript = [
    {
        name: "typescript",
        description: "Would you like to use TypeScript? (y/n)",
        pattern: /y[es]*|n[o]?/,
        default: "yes",
    },
];
var downloadMedia = [
    {
        name: "downloadMedia",
        description: "Would you like to download the media from the databases? (y/n)",
        pattern: /y[es]*|n[o]?/,
        default: "yes",
    },
];
var typesDestinationFolderPath = [
    {
        name: "typesFolderPath",
        description: "Notion-on-next will generate types for you. By default, it will use ./types as the folder to store them. If you would like to change the destination folder, please enter the path or hit enter to use the default.",
        type: "string",
        default: "./types",
        pattern: /^(\.\/)?[a-zA-Z0-9_\-]+$/,
        message: "Please enter a valid path",
    },
];
var collectDbIds = [
    {
        name: "databaseIds",
        description: "Please enter the database IDs you would like to set up (comma separated)",
        // Pattern checks for comma separated list of 32 or 28 character alphanumeric strings that may or may not be separated by hyphens such as the two below
        // 12c9bf144f9a429b8fffd63c58694c54, 5b3247dc-63b8-4fd1-b610-5e5a8aabd397
        pattern: /^([a-zA-Z0-9]{32}|[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})(,\s?([a-zA-Z0-9]{32}|[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}))*$/,
        message: "Please make sure you are entering a comma separated list database IDs, which are 32 alphanumeric characters with hyphens or 28 characters without. ",
    },
];
var configTemplate = {
    databases: {},
    typesFolderPath: "./types",
};
var setup = function () {
    var responses = {
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
            .map(function (id) { return id.trim(); });
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
                }
                else {
                    responses.typesFolderPath = null;
                    processResponses(responses);
                }
            });
        });
    });
};
exports.setup = setup;
var processResponses = function (responses) { return __awaiter(void 0, void 0, void 0, function () {
    var configTemplate, typesFolderPath, _i, _a, id, database;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                configTemplate = {
                    databases: {},
                    typesFolderPath: "./types",
                };
                if (!responses.typescript) return [3 /*break*/, 2];
                typesFolderPath = responses.typesFolderPath;
                // Check if folder typesFolderPath exists
                if (!fs.existsSync(typesFolderPath)) {
                    fs.mkdirSync(typesFolderPath);
                    // Create a file in the folder called notion-on-next.types.ts
                }
                console.log("Creating types file", "".concat(typesFolderPath, "/notion-on-next.types.ts"));
                return [4 /*yield*/, (0, generateTypes_1.initializeTypes)("".concat(typesFolderPath, "/notion-on-next.types.ts"))];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                configTemplate.typesFolderPath = null;
                _b.label = 3;
            case 3:
                _i = 0, _a = responses.databaseIds;
                _b.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                id = _a[_i];
                return [4 /*yield*/, (0, getFromNotion_1.getDatabase)(id)];
            case 5:
                database = _b.sent();
                if (!database) {
                    console.log("Database ".concat(id, " not found"));
                    return [2 /*return*/];
                }
                // If the id is unhypenated, then add the hyphens in this pattern 1a67ddff-a029-4cdc-b860-beb64cce9c77
                if (id.length === 32) {
                    id = "".concat(id.slice(0, 8), "-").concat(id.slice(8, 12), "-").concat(id.slice(12, 16), "-").concat(id.slice(16, 20), "-").concat(id.slice(20));
                }
                // Add the database to the config file
                configTemplate.databases[id] = {
                    id: id,
                    // @ts-ignore -- Notion API types are not consistent with the actual API
                    name: database.title[0].plain_text,
                };
                if (!responses.typescript) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, utils_1.createFolderIfDoesNotExist)("".concat(responses.typesFolderPath))];
            case 6:
                _b.sent();
                (0, generateTypes_1.generateTypesFromDatabase)("".concat(responses.typesFolderPath, "/notion-on-next.types.ts"), database);
                _b.label = 7;
            case 7:
                // If downloadMedia is true, then download the media
                if (responses.downloadMedia) {
                    (0, downloadMedia_1.fetchImages)(database.id);
                }
                _b.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 4];
            case 9:
                fs.writeFileSync("./notion-on-next.config.json", JSON.stringify(configTemplate));
                return [2 /*return*/];
        }
    });
}); };
