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
exports.Block = void 0;
var types_1 = require("../../types/types");
var client_1 = require("@notionhq/client");
var image_1 = __importDefault(require("next/image"));
var RichText_1 = require("../RichText");
var index_1 = require("../../index");
var react_1 = __importDefault(require("react"));
/**
 * A recursive component that renders a Notion block and child blocks.
 * @param mediaMap is an object that notion-on-next generates for you. Find it in public/notion-media/media-map.json.
 */
exports.Block = (0, types_1.asyncComponent)(function (_a) {
    var block = _a.block, blocks = _a.blocks, mediaMap = _a.mediaMap, databaseId = _a.databaseId, pageId = _a.pageId;
    return __awaiter(void 0, void 0, void 0, function () {
        var children, childBlocks_1, imageUrl, videoUrl, itemPosition, listNumber, i, blocksBlock;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(0, client_1.isFullBlock)(block)) {
                        return [2 /*return*/, react_1.default.createElement(react_1.default.Fragment, null)];
                    }
                    if (!block.has_children) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, index_1.getBlocks)(block.id)];
                case 1:
                    childBlocks_1 = _b.sent();
                    children = childBlocks_1 === null || childBlocks_1 === void 0 ? void 0 : childBlocks_1.map(function (child) {
                        if (child) {
                            return (react_1.default.createElement(exports.Block, { block: child, databaseId: databaseId, pageId: pageId, key: child.id, blocks: childBlocks_1 }));
                        }
                        else {
                            // Prevents undefined block error
                            return react_1.default.createElement(react_1.default.Fragment, null);
                        }
                    });
                    _b.label = 2;
                case 2:
                    // Add support for any block type here. You can add custom styling wherever you'd like.
                    switch (block.type) {
                        case "heading_1":
                            //@ts-ignore Notion types are incorrect
                            if (block.heading_1.is_toggleable) {
                                return [2 /*return*/, (react_1.default.createElement("details", { className: "notion_".concat(block.type) },
                                        react_1.default.createElement("summary", null,
                                            react_1.default.createElement(RichText_1.RichText, { rich_text: block.heading_1.rich_text })),
                                        children))];
                            }
                            return [2 /*return*/, (react_1.default.createElement("h1", { className: "notion_".concat(block.type) },
                                    react_1.default.createElement(RichText_1.RichText, { rich_text: block.heading_1.rich_text })))];
                        case "heading_2":
                            //@ts-ignore Notion types are incorrect
                            if (block.heading_2.is_toggleable) {
                                return [2 /*return*/, (react_1.default.createElement(react_1.default.Fragment, null,
                                        react_1.default.createElement("details", { className: "notion_".concat(block.type) },
                                            react_1.default.createElement("summary", null,
                                                react_1.default.createElement(RichText_1.RichText, { rich_text: block.heading_2.rich_text })),
                                            children)))];
                            }
                            return [2 /*return*/, (react_1.default.createElement("h2", { className: "notion_".concat(block.type) },
                                    react_1.default.createElement(RichText_1.RichText, { rich_text: block.heading_2.rich_text })))];
                        case "heading_3":
                            //@ts-ignore Notion types are incorrect
                            if (block.heading_3.is_toggleable) {
                                return [2 /*return*/, (react_1.default.createElement(react_1.default.Fragment, null,
                                        react_1.default.createElement("details", { className: "notion_".concat(block.type) },
                                            react_1.default.createElement("summary", null,
                                                react_1.default.createElement(RichText_1.RichText, { rich_text: block.heading_3.rich_text })),
                                            children)))];
                            }
                            return [2 /*return*/, (react_1.default.createElement("h3", { className: "notion_".concat(block.type) },
                                    react_1.default.createElement(RichText_1.RichText, { rich_text: block.heading_3.rich_text })))];
                        case "paragraph":
                            return [2 /*return*/, (react_1.default.createElement("p", { className: "notion_".concat(block.type) },
                                    react_1.default.createElement(RichText_1.RichText, { rich_text: block.paragraph.rich_text })))];
                        case "image":
                            imageUrl = databaseId && pageId && mediaMap
                                ? mediaMap[databaseId][pageId][block.id]
                                : block.image.type == "external"
                                    ? block.image.external.url
                                    : block.image.file.url;
                            return [2 /*return*/, (react_1.default.createElement(image_1.default, { src: imageUrl || "/fallback.png", alt: "Notion page image", width: 700, height: 700 }))];
                        case "video":
                            videoUrl = databaseId && pageId && mediaMap
                                ? mediaMap[databaseId][pageId][block.id]
                                : block.video.type == "external"
                                    ? block.video.external.url
                                    : block.video.file.url;
                            if (videoUrl) {
                                return [2 /*return*/, (react_1.default.createElement("video", { controls: true, src: videoUrl, className: "notion_".concat(block.type) }))];
                            }
                            else {
                                return [2 /*return*/, react_1.default.createElement("div", { className: "" }, "Video URL not found")];
                            }
                        case "bulleted_list_item":
                            return [2 /*return*/, (react_1.default.createElement("ul", { className: "notion_bulleted_list_container" },
                                    react_1.default.createElement("li", { className: "notion_".concat(block.type) },
                                        react_1.default.createElement(RichText_1.RichText, { rich_text: block.bulleted_list_item.rich_text })),
                                    children))];
                        case "numbered_list_item":
                            itemPosition = blocks.findIndex(function (blocksBlock) { return block.id === blocksBlock.id; });
                            listNumber = 0;
                            for (i = itemPosition; i >= 0; i--) {
                                blocksBlock = blocks[i];
                                if (blocksBlock.type === "numbered_list_item") {
                                    listNumber++;
                                }
                                else {
                                    break;
                                }
                            }
                            return [2 /*return*/, (react_1.default.createElement("ol", { start: listNumber, className: "notion_numbered_list_container" },
                                    react_1.default.createElement("li", { className: "notion_".concat(block.type) },
                                        react_1.default.createElement(RichText_1.RichText, { rich_text: block.numbered_list_item.rich_text })),
                                    children))];
                        case "code":
                            return [2 /*return*/, (
                                // className="max-w-screen overflo-x-auto w-full"
                                react_1.default.createElement("div", { className: "notion_".concat(block.type) }, "Code"))];
                        case "column_list":
                            // className={`flex justify-between gap-2`}
                            return [2 /*return*/, react_1.default.createElement("div", { className: "notion_".concat(block.type) }, children)];
                        case "column":
                            // className="word-wrap break-all p-4"
                            return [2 /*return*/, react_1.default.createElement("div", { className: "notion_".concat(block.type) }, children)];
                        case "quote":
                            // className="border-l-4 border-gray-300 pl-4
                            return [2 /*return*/, (react_1.default.createElement("blockquote", { className: "notion_".concat(block.type) },
                                    react_1.default.createElement(RichText_1.RichText, { rich_text: block.quote.rich_text })))];
                        case "divider":
                            return [2 /*return*/, react_1.default.createElement("hr", null)];
                        case "to_do":
                            return [2 /*return*/, (
                                // className="flex items-center"
                                // className="mr-2"
                                react_1.default.createElement("div", { className: "notion_".concat(block.type, "_container") },
                                    react_1.default.createElement("input", { type: "checkbox", checked: block.to_do.checked, readOnly: true, className: "notion_".concat(block.type) }),
                                    react_1.default.createElement(RichText_1.RichText, { rich_text: block.to_do.rich_text })))];
                        case "toggle":
                            return [2 /*return*/, (react_1.default.createElement("details", { className: "notion_".concat(block.type, "_container") },
                                    react_1.default.createElement("summary", null,
                                        react_1.default.createElement(RichText_1.RichText, { rich_text: block.toggle.rich_text })),
                                    children))];
                        default:
                            return [2 /*return*/, react_1.default.createElement("div", null,
                                    "Block ",
                                    block.type,
                                    " not supported")];
                    }
                    return [2 /*return*/];
            }
        });
    });
});
