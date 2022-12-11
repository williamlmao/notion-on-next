"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code = void 0;
var hljs_1 = require("react-syntax-highlighter/dist/cjs/styles/hljs");
var react_1 = __importDefault(require("react"));
var default_highlight_1 = __importDefault(require("react-syntax-highlighter/dist/cjs/default-highlight"));
// //@ts-ignore
// const DynamicSyntaxHighlighter = dynamic(
//   () => import("react-syntax-highlighter"),
//   {
//     suspense: true,
//   }
// );
var Code = function (_a) {
    var text = _a.text, language = _a.language;
    return (react_1.default.createElement(default_highlight_1.default, { language: language, style: hljs_1.atomOneDark }, text));
};
exports.Code = Code;
