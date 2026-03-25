"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firststageLabour_1 = __importDefault(require("../../controllers/maternity/firststageLabour"));
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
// Create new first stage labour record
router.post("/create", middleware_1.protect, firststageLabour_1.default.createFirstStageLabour);
// Get all first stage labour records
router.get("/getall", middleware_1.protect, firststageLabour_1.default.getFirstStageLabour);
// Get first stage labour by ID
router.get("/get/:id", middleware_1.protect, firststageLabour_1.default.getFirstStageLabourById);
// Get first stage labour by patient ID
router.get("/patient/:patientId", middleware_1.protect, firststageLabour_1.default.getFirstStageLabourByPatientId);
// Update first stage labour record
router.put("/update/:id", middleware_1.protect, firststageLabour_1.default.updateFirstStageLabour);
// Get paginated first stage labour records
router.get("/paginated", middleware_1.protect, firststageLabour_1.default.getFirstStageLabourPaginated);
exports.default = router;
