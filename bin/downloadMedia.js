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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadMediaToFolder = exports.fetchImages = exports.downloadMedia = void 0;
var client_1 = require("@notionhq/client");
var fs_1 = __importDefault(require("fs"));
var request_1 = __importDefault(require("request"));
var index_1 = require("../index");
var utils_1 = require("./utils");
var downloadMedia = function () { return __awaiter(void 0, void 0, void 0, function () {
    var configPath, config, _a, _b, _i, databaseId;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                configPath = "./notion-on-next.config.json";
                config = JSON.parse(fs_1.default.readFileSync(configPath, "utf8"));
                _a = [];
                for (_b in config.databases)
                    _a.push(_b);
                _i = 0;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                databaseId = _a[_i];
                return [4 /*yield*/, fetchImages(databaseId)];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.downloadMedia = downloadMedia;
function fetchImages(databaseId, pages, update) {
    return __awaiter(this, void 0, void 0, function () {
        var mediaMapPath, mediaMap, basePath, databasePath, unparsedPages, _loop_1, _i, pages_1, page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mediaMapPath = "./public/notion-media/media-map.json";
                    mediaMap = JSON.parse(fs_1.default.readFileSync(mediaMapPath, "utf8"));
                    basePath = "./public/notion-media";
                    return [4 /*yield*/, (0, utils_1.createFolderIfDoesNotExist)("".concat(basePath))];
                case 1:
                    _a.sent();
                    databasePath = "".concat(basePath, "/").concat(databaseId);
                    if (!mediaMap[databaseId]) {
                        mediaMap[databaseId] = {};
                    }
                    return [4 /*yield*/, (0, utils_1.createFolderIfDoesNotExist)("".concat(databasePath))];
                case 2:
                    _a.sent();
                    if (!!pages) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, index_1.getPages)(databaseId)];
                case 3:
                    unparsedPages = _a.sent();
                    return [4 /*yield*/, (0, index_1.parsePages)(unparsedPages)];
                case 4:
                    pages = _a.sent();
                    _a.label = 5;
                case 5:
                    _loop_1 = function (page) {
                        var mediaMapDb, pageId, pageFolderPath, fileExtension, coverImagePath, coverImagePathWithoutPublic, blocks, _loop_2, _b, blocks_1, block;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    mediaMapDb = mediaMap[databaseId];
                                    pageId = page.id;
                                    // @ts-ignore -- TODO: Fix this type error
                                    mediaMapDb[pageId] = {};
                                    pageFolderPath = "".concat(databasePath, "/").concat(pageId);
                                    console.log("pageFolderPath: ", pageFolderPath);
                                    return [4 /*yield*/, (0, utils_1.createFolderIfDoesNotExist)("".concat(pageFolderPath))];
                                case 1:
                                    _c.sent();
                                    if (!page.coverImage) return [3 /*break*/, 3];
                                    fileExtension = (0, utils_1.getFileExtension)(page.coverImage);
                                    coverImagePath = "".concat(pageFolderPath, "/cover.").concat(fileExtension);
                                    coverImagePathWithoutPublic = "/notion-media/".concat(databaseId, "/").concat(pageId, "/cover.").concat(fileExtension);
                                    // @ts-ignore -- TODO: Fix this type error
                                    mediaMap[databaseId][pageId].cover = coverImagePathWithoutPublic;
                                    return [4 /*yield*/, (0, exports.downloadMediaToFolder)(page.coverImage, coverImagePath, function () {
                                            console.log("Downloaded cover image for ".concat(pageId));
                                        }, update)];
                                case 2:
                                    _c.sent();
                                    _c.label = 3;
                                case 3: return [4 /*yield*/, (0, index_1.getBlocks)(pageId)];
                                case 4:
                                    blocks = _c.sent();
                                    _loop_2 = function (block) {
                                        var blockId = block.id;
                                        if (!(0, client_1.isFullBlock)(block)) {
                                            return "continue";
                                        }
                                        var url = void 0;
                                        if (block.type === "image") {
                                            var image = block.image;
                                            url = image.type === "external" ? image.external.url : image.file.url;
                                        }
                                        if (block.type === "video") {
                                            var video = block.video;
                                            url = video.type === "external" ? video.external.url : video.file.url;
                                        }
                                        if (!url) {
                                            return "continue";
                                        }
                                        var fileExtension = (0, utils_1.getFileExtension)(url);
                                        var blockImagePath = "".concat(pageFolderPath, "/").concat(blockId, ".").concat(fileExtension);
                                        var blockImagePathWithoutPublic = "/notion-media/".concat(databaseId, "/").concat(pageId, "/").concat(blockId, ".").concat(fileExtension);
                                        // @ts-ignore -- TODO: Fix this type error
                                        mediaMap[databaseId][pageId][blockId] = blockImagePathWithoutPublic;
                                        (0, exports.downloadMediaToFolder)(url, blockImagePath, function () {
                                            console.log("Downloaded image for ".concat(blockId));
                                        }, update);
                                    };
                                    for (_b = 0, blocks_1 = blocks; _b < blocks_1.length; _b++) {
                                        block = blocks_1[_b];
                                        _loop_2(block);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, pages_1 = pages;
                    _a.label = 6;
                case 6:
                    if (!(_i < pages_1.length)) return [3 /*break*/, 9];
                    page = pages_1[_i];
                    return [5 /*yield**/, _loop_1(page)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    // // Write the image map to a .json file
                    fs_1.default.writeFileSync("".concat(basePath, "/media-map.json"), JSON.stringify(mediaMap));
                    return [2 /*return*/];
            }
        });
    });
}
exports.fetchImages = fetchImages;
var downloadMediaToFolder = function (url, path, callback, update) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (fs_1.default.existsSync(path) && !update) {
                    console.log("File already exists, skipping download");
                    callback();
                    return [2 /*return*/];
                }
                // overwrite if file already exists
                return [4 /*yield*/, request_1.default.head(url, function (err, res, body) {
                        (0, request_1.default)(url).pipe(fs_1.default.createWriteStream(path)).on("close", callback);
                    })];
            case 1:
                // overwrite if file already exists
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.downloadMediaToFolder = downloadMediaToFolder;
