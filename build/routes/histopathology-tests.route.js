"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const histopathologytest_controller_1 = require("../controllers/histopathology/histopathologytest.controller");
const router = express_1.default.Router();
router.post("", histopathologytest_controller_1.CreateReportTest);
router.get("/:id", histopathologytest_controller_1.getHistopathologyTestById);
router.get("", histopathologytest_controller_1.getAllHistopathologyExamRecordPaginatedHandler);
router.get("/test-details/:id", histopathologytest_controller_1.getHistopathologyTestDetails);
exports.default = router;
