"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postnatalcare_1 = __importDefault(require("../../controllers/maternity/postnatalcare"));
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
// Create new postnatal care record
router.post("/create", middleware_1.protect, postnatalcare_1.default.createPostnatalCare);
// Get all postnatal care records
router.get("/getall", middleware_1.protect, postnatalcare_1.default.getPostnatalCare);
// Get postnatal care by ID
router.get("/get/:id", middleware_1.protect, postnatalcare_1.default.getPostnatalCareById);
// Get postnatal care by patient ID
router.get("/patient/:patientId", middleware_1.protect, postnatalcare_1.default.getPostnatalCareByPatientId);
// Update postnatal care record
router.put("/update/:id", middleware_1.protect, postnatalcare_1.default.updatePostnatalCare);
// Get paginated postnatal care records
router.get("/paginated", middleware_1.protect, postnatalcare_1.default.getPostnatalCarePaginated);
exports.default = router;
