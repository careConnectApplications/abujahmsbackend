"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const immunization_1 = require("../controllers/immunization/immunization");
const router = express_1.default.Router();
router.post('/createimmunizations/:id', immunization_1.createimmunizations);
router.put('/updateimmunizations/:id', immunization_1.updateimmunizations);
router.get('/readallimmunizationbypatient/:patient', immunization_1.readAllimmunizationByPatient);
exports.default = router;
