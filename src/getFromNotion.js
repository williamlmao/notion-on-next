"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getBlocks = exports.getParsedPages = exports.getPages = exports.parsePages = exports.getDatabase = exports.notion = void 0;
var client_1 = require("@notionhq/client");
var dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
exports.notion = new client_1.Client({ auth: process.env.NOTION_KEY });
var getDatabase = function (databaseId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, exports.notion.databases.retrieve({
                        database_id: databaseId,
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
            case 2:
                e_1 = _a.sent();
                console.error("Error: The database ID you provided is invalid. Please double check that you have set up the Notion API integration with the database, and that you are providing the right database IDs.");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getDatabase = getDatabase;
/**
 * This function pulls out the required types for notion-on-next: slug, title, and cover image to make these properties more accessible.
 * It also accepts a generic type which is meant to be passed down from getParsedPages, but can be used elsewhere.
 */
var parsePages = function (pages) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedPages;
    return __generator(this, function (_a) {
        parsedPages = pages.map(function (page) {
            var _a, _b, _c, _d, _e, _f;
            if (!(0, client_1.isFullPage)(page)) {
                return page;
            }
            var slug = page.url
                .split("/")
                .slice(3)
                .join("/")
                .split("-")
                .slice(0, -1)
                .join("-");
            // Working around type errors: https://github.com/makenotion/notion-sdk-js/issues/154
            var nameProp = page.properties.Name;
            var title;
            if ((nameProp === null || nameProp === void 0 ? void 0 : nameProp.type) === "title") {
                title = (_a = nameProp === null || nameProp === void 0 ? void 0 : nameProp.title[0]) === null || _a === void 0 ? void 0 : _a.plain_text;
            }
            return __assign(__assign({}, page), { slug: slug, title: title, coverImage: ((_b = page === null || page === void 0 ? void 0 : page.cover) === null || _b === void 0 ? void 0 : _b.type) === "file"
                    ? (_d = (_c = page === null || page === void 0 ? void 0 : page.cover) === null || _c === void 0 ? void 0 : _c.file) === null || _d === void 0 ? void 0 : _d.url
                    : (_f = (_e = page === null || page === void 0 ? void 0 : page.cover) === null || _e === void 0 ? void 0 : _e.external) === null || _f === void 0 ? void 0 : _f.url });
        });
        return [2 /*return*/, parsedPages];
    });
}); };
exports.parsePages = parsePages;
/**
 * This is a cached function that fetches all pages from a Notion database.
 */
var getPages = function (databaseId) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.notion.databases.query({
                    database_id: databaseId,
                })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.results];
        }
    });
}); };
exports.getPages = getPages;
/**
 * Gets all pages from a Notion database and parses them into a more usable format.
 * Accepts a generic type, which is generated for you after running setup in notion-on-next.
 * The generic type should be a version of PageObjectResponse, but with your database's properties.
 */
var getParsedPages = function (databaseId) { return __awaiter(void 0, void 0, void 0, function () {
    var pages, parsedPages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getPages)(databaseId)];
            case 1:
                pages = _a.sent();
                return [4 /*yield*/, (0, exports.parsePages)(pages)];
            case 2:
                parsedPages = _a.sent();
                return [2 /*return*/, parsedPages];
        }
    });
}); };
exports.getParsedPages = getParsedPages;
var getBlocks = function (pageId) { return __awaiter(void 0, void 0, void 0, function () {
    var blocks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, client_1.collectPaginatedAPI)(exports.notion.blocks.children.list, {
                    block_id: pageId,
                })];
            case 1:
                blocks = _a.sent();
                return [2 /*return*/, blocks];
        }
    });
}); };
exports.getBlocks = getBlocks;
