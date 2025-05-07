"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nutrition_1 = require("../controllers/nutrition/nutrition");
const router = express_1.default.Router();
router.post('/createnutritions/:id', nutrition_1.createnutritions);
router.put('/updatenutritions/:id', nutrition_1.updatenutritions);
router.get('/readallnutritionbypatient/:patient', nutrition_1.readAllnutritionByPatient);
exports.default = router;
