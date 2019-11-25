"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const addressBook_1 = __importDefault(require("@/routes/addressBook"));
const contact_1 = __importDefault(require("@/routes/contact"));
const PORT = process.env.PORT || 5000;
express_1.default()
    .use(express_1.default.json())
    .use(body_parser_1.default.urlencoded({ extended: true }))
    .use('/', addressBook_1.default)
    .use('/', contact_1.default)
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
//# sourceMappingURL=app.js.map