"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const familyplanning_1 = require("../controllers/familyplanning/familyplanning");
const router = express_1.default.Router();
router.post('/createfamilyplanning/:id', familyplanning_1.createfamilyplanning);
router.put('/updatefamilyplanning/:id', familyplanning_1.updatefamilyplanning);
router.get('/readallfamilyplanningbypatient/:patient', familyplanning_1.readAllfamilyplanningByPatient);
exports.default = router;
