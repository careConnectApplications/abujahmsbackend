"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mortalityregister_1 = __importDefault(require("../../controllers/maternity/mortalityregister"));
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
// Create new mortality register record
router.post("/create", middleware_1.protect, mortalityregister_1.default.createMortalityRegister);
// Get all mortality register records
router.get("/getall", middleware_1.protect, mortalityregister_1.default.getMortalityRegister);
// Get mortality register by ID
router.get("/get/:id", middleware_1.protect, mortalityregister_1.default.getMortalityRegisterById);
// Get mortality register by patient ID
router.get("/patient/:patientId", middleware_1.protect, mortalityregister_1.default.getMortalityRegisterByPatientId);
// Update mortality register record
router.put("/update/:id", middleware_1.protect, mortalityregister_1.default.updateMortalityRegister);
// Get paginated mortality register records
router.get("/paginated", middleware_1.protect, mortalityregister_1.default.getMortalityRegisterPaginated);
exports.default = router;
