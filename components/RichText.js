"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichText = void 0;
var react_1 = __importDefault(require("react"));
var RichText = function (_a) {
    var rich_text = _a.rich_text;
    return (react_1.default.createElement(react_1.default.Fragment, null, rich_text.map(function (rich_text_item, index) {
        var _a = rich_text_item.annotations, bold = _a.bold, italic = _a.italic, strikethrough = _a.strikethrough, underline = _a.underline, code = _a.code;
        var color = rich_text_item.annotations.color.includes("background")
            ? { backgroundColor: rich_text_item.annotations.color.split("_")[0] }
            : { color: rich_text_item.annotations.color };
        var text = react_1.default.createElement("span", { style: color }, rich_text_item.plain_text);
        if (bold) {
            text = react_1.default.createElement("strong", null, text);
        }
        if (italic) {
            text = react_1.default.createElement("em", null, text);
        }
        if (strikethrough) {
            text = react_1.default.createElement("del", null, text);
        }
        if (underline) {
            text = react_1.default.createElement("u", null, text);
        }
        if (code) {
            // Remove "`" from text
            text = react_1.default.createElement("code", { className: "bg-gray-600 text-red-500" }, text);
        }
        if (rich_text_item.href) {
            text = (react_1.default.createElement("a", { href: rich_text_item.href, target: "_blank", rel: "noreferrer" }, text));
        }
        return (react_1.default.createElement(react_1.default.Fragment, { key: index + rich_text_item.plain_text }, text));
    })));
};
exports.RichText = RichText;
