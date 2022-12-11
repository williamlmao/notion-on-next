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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendToFile = exports.replaceImports = exports.updateImports = exports.generateTypesFromDatabase = exports.initializeTypes = exports.generateTypes = void 0;
var fs_1 = __importDefault(require("fs"));
var getFromNotion_1 = require("../src/getFromNotion");
var utils_1 = require("./utils");
var generateTypes = function () { return __awaiter(void 0, void 0, void 0, function () {
    var configPath, config, _a, _b, _i, databaseId, database;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                configPath = "./notion-on-next.config.json";
                config = JSON.parse(fs_1.default.readFileSync(configPath, "utf8"));
                return [4 /*yield*/, (0, utils_1.createFolderIfDoesNotExist)("".concat(config.typesFolderPath))];
            case 1:
                _c.sent();
                // Generate types from the user's config file
                return [4 /*yield*/, (0, exports.initializeTypes)("".concat(config.typesFolderPath, "/notion-on-next.types.ts"))];
            case 2:
                // Generate types from the user's config file
                _c.sent();
                _a = [];
                for (_b in config.databases)
                    _a.push(_b);
                _i = 0;
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                databaseId = _a[_i];
                return [4 /*yield*/, (0, getFromNotion_1.getDatabase)(databaseId)];
            case 4:
                database = _c.sent();
                if (!database) {
                    console.log("Could not find database with id ".concat(databaseId, ". Please check your config file."));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, exports.generateTypesFromDatabase)("".concat(config.typesFolderPath, "/notion-on-next.types.ts"), database)];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.generateTypes = generateTypes;
var initializeTypes = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        fs_1.default.writeFileSync(path, "\n      import {\n        PageObjectResponse,\n      } from \"@notionhq/client/build/src/api-endpoints\";\n      \n      export interface NotionOnNextPageObjectResponse extends PageObjectResponse {\n        slug: string | undefined;\n        title: string | undefined;\n        coverImage: string | undefined;\n      }\n      export interface mediaMapInterface {\n        [key: string]: {\n          [key: string]: {\n            [key: string]: string;\n          };\n        };\n      }\n      ");
        console.log("Created notion-on-next.types.ts");
        return [2 /*return*/];
    });
}); };
exports.initializeTypes = initializeTypes;
var generateTypesFromDatabase = function (path, database) { return __awaiter(void 0, void 0, void 0, function () {
    var databaseName, databaseProperties, propertyTypeMap, allBlockTypesFromResponse, uniqueBlockTypesFromDatabase, allBlockTypeImports, typeDefStart, typeDefEnd, typeDefProperties, typeDef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                databaseName = database.title[0].plain_text.replace(/[^a-z0-9]/gi, "");
                databaseProperties = database.properties;
                propertyTypeMap = {
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
                allBlockTypesFromResponse = Object.keys(databaseProperties).map(function (key) {
                    var property = databaseProperties[key];
                    return property.type;
                });
                uniqueBlockTypesFromDatabase = Array.from(new Set(allBlockTypesFromResponse));
                console.log("uniqueBlockTypesFromDatabase", uniqueBlockTypesFromDatabase);
                allBlockTypeImports = uniqueBlockTypesFromDatabase
                    .map(function (type) { return propertyTypeMap[type]; })
                    .filter(Boolean);
                return [4 /*yield*/, (0, exports.updateImports)(path, allBlockTypeImports)];
            case 1:
                _a.sent();
                typeDefStart = "\nexport type ".concat(databaseName, "PageObjectResponse = NotionOnNextPageObjectResponse & {\n\tproperties: {\n");
                typeDefEnd = "\n\t}\n}";
                typeDefProperties = Object.keys(databaseProperties).map(function (key) {
                    var property = databaseProperties[key];
                    var propertyType = property.type;
                    var propertyTypeMapped = propertyTypeMap[propertyType];
                    return "\t\t'".concat(key, "': ").concat(propertyTypeMapped, ";");
                });
                typeDef = typeDefStart + typeDefProperties.join("\n") + typeDefEnd;
                return [4 /*yield*/, (0, exports.appendToFile)(path, typeDef, function () {
                        console.log("Appended files to" + path);
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.generateTypesFromDatabase = generateTypesFromDatabase;
var extractImports = function (notionImportString) {
    // Pull out the items from the import statement
    //@ts-ignore
    var items = notionImportString
        .match(/{[^}]*}/g)[0]
        .replace(/[{}]/g, "")
        .replace(/\s/g, "")
        .replace(/,\n/g, "")
        .trim()
        .split(",");
    return items;
};
var updateImports = function (filePath, uniqueBlockTypesFromDatabase) {
    // return a promise
    return new Promise(function (resolve, reject) {
        fs_1.default.readFile(filePath, "utf-8", function (err, contents) {
            var _a;
            if (err) {
                console.log(err);
                return reject(err);
            }
            var notionImportString = (_a = contents.match(/import\s*{[^}]*}\s*from\s*["']@notionhq\/client\/build\/src\/api-endpoints["']/g)) === null || _a === void 0 ? void 0 : _a[0];
            if (!notionImportString) {
                console.log("Could not find notion import string");
                return;
            }
            var currentImportedNotionTypes = extractImports(notionImportString);
            var combinedTypeImports = Array.from(new Set(__spreadArray(__spreadArray(__spreadArray([], currentImportedNotionTypes, true), uniqueBlockTypesFromDatabase, true), [
                "PageObjectResponse",
            ], false)));
            // Filter out dupes
            var uniqueCombinedTypeImports = Array.from(new Set(combinedTypeImports)).filter(Boolean);
            var updatedNotionImports = "import { ".concat(uniqueCombinedTypeImports.join(", "), " } from \"@notionhq/client/build/src/api-endpoints\";");
            var updatedContents = contents.replace(notionImportString, updatedNotionImports);
            fs_1.default.writeFile(filePath, updatedContents, "utf-8", function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Updated imports in ", filePath);
                resolve("done");
            });
        });
    });
};
exports.updateImports = updateImports;
var replaceImports = function (filePath, newImports) {
    // return a promise
    return new Promise(function (resolve, reject) {
        fs_1.default.readFile(filePath, "utf-8", function (err, contents) {
            var _a;
            if (err) {
                console.log(err);
                return reject(err);
            }
            var currentImports = (_a = contents
                .match(/import \{(.|\n)*?\} from/g)) === null || _a === void 0 ? void 0 : _a[0].split(",").map(function (currentImport) { return currentImport.trim(); });
            console.log("currentImports", currentImports);
            var updatedImports = "";
            if (currentImports) {
                console.log("inside of current imports");
                // Filter out any newImports that already exist in currentImports
                var newImportsFiltered = newImports
                    .split(",")
                    .map(function (newImport) { return newImport.trim(); })
                    .filter(function (newImport) {
                    return !currentImports.includes(newImport);
                });
                var combinedImports = __spreadArray(__spreadArray([], currentImports, true), [newImportsFiltered], false);
                console.log("combinedImports", combinedImports);
                updatedImports = combinedImports.join(", ");
            }
            else {
                updatedImports = newImports;
            }
            // const newContents is replacing anything between "import {" and "} from"
            var newContents = contents.replace(/import \{(.|\n)*?\} from/g, newImports);
            fs_1.default.writeFile(filePath, newContents, "utf-8", function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Updated imports in ", filePath);
                resolve("done");
            });
        });
    });
};
exports.replaceImports = replaceImports;
var appendToFile = function (filePath, data, callback) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                fs_1.default.appendFile(filePath, data, function (err) {
                    if (err)
                        reject(err);
                    callback();
                    resolve("done");
                });
            })];
    });
}); };
exports.appendToFile = appendToFile;
