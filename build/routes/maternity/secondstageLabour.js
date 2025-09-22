"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const secondstageLabour_1 = __importDefault(require("../../controllers/maternity/secondstageLabour"));
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
// Create new second stage labour record
router.post("/create", middleware_1.protect, secondstageLabour_1.default.createSecondStageLabour);
// Get all second stage labour records
router.get("/getall", middleware_1.protect, secondstageLabour_1.default.getSecondStageLabour);
// Get second stage labour by ID
router.get("/get/:id", middleware_1.protect, secondstageLabour_1.default.getSecondStageLabourById);
// Get second stage labour by patient ID
router.get("/patient/:patientId", middleware_1.protect, secondstageLabour_1.default.getSecondStageLabourByPatientId);
// Update second stage labour record
router.put("/update/:id", middleware_1.protect, secondstageLabour_1.default.updateSecondStageLabour);
// Get paginated second stage labour records
router.get("/paginated", middleware_1.protect, secondstageLabour_1.default.getSecondStageLabourPaginated);
exports.default = router;
