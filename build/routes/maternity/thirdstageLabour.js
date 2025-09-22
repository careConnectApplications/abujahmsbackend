"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const thirdstageLabour_1 = __importDefault(require("../../controllers/maternity/thirdstageLabour"));
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
// Create new third stage labour record
router.post("/create", middleware_1.protect, thirdstageLabour_1.default.createThirdStageLabour);
// Get all third stage labour records
router.get("/getall", middleware_1.protect, thirdstageLabour_1.default.getThirdStageLabour);
// Get third stage labour by ID
router.get("/get/:id", middleware_1.protect, thirdstageLabour_1.default.getThirdStageLabourById);
// Get third stage labour by patient ID
router.get("/patient/:patientId", middleware_1.protect, thirdstageLabour_1.default.getThirdStageLabourByPatientId);
// Update third stage labour record
router.put("/update/:id", middleware_1.protect, thirdstageLabour_1.default.updateThirdStageLabour);
// Get paginated third stage labour records
router.get("/paginated", middleware_1.protect, thirdstageLabour_1.default.getThirdStageLabourPaginated);
// Aggregate third stage labour data
exports.default = router;
