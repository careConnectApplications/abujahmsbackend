"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const birthregister_1 = __importDefault(require("../../controllers/maternity/birthregister"));
const middleware_1 = require("../../utils/middleware");
const router = (0, express_1.Router)();
// Create new birth register record
router.post("/create", middleware_1.protect, birthregister_1.default.createBirthRegister);
// Get all birth register records
router.get("/getall", middleware_1.protect, birthregister_1.default.getBirthRegister);
// Get birth register by ID
router.get("/get/:id", middleware_1.protect, birthregister_1.default.getBirthRegisterById);
// Get birth register by patient ID
router.get("/patient/:patientId", middleware_1.protect, birthregister_1.default.getBirthRegisterByPatientId);
// Update birth register record
router.put("/update/:id", middleware_1.protect, birthregister_1.default.updateBirthRegister);
// Get paginated birth register records
router.get("/paginated", middleware_1.protect, birthregister_1.default.getBirthRegisterPaginated);
// Get birth register count
exports.default = router;
