"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const histopathology_controller_1 = require("../controllers/histopathology/histopathology.controller");
const router = express_1.default.Router();
router.post("", histopathology_controller_1.CreateHistopatholgyService);
router.get("", histopathology_controller_1.getAllHistopathologyDashboard); // getAllHistopathologyPaginatedHandler
router.get("/:id", histopathology_controller_1.getHistopathologyRecordById);
router.post("/:id/tests", histopathology_controller_1.CreateMultipleTestReport);
////test/:id to post to post all exam/result
/// put /:id to update record details
exports.default = router;
