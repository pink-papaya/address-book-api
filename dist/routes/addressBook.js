"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressBookController_1 = __importDefault(require("@/controllers/addressBookController"));
const router = express_1.default.Router();
router.get('/', addressBookController_1.default.getAll);
router.get('/:id', addressBookController_1.default.getById);
router.post('/', addressBookController_1.default.create);
router.put('/:id', addressBookController_1.default.update);
router.delete('/:id', addressBookController_1.default.delete);
exports.default = router;
//# sourceMappingURL=addressBook.js.map