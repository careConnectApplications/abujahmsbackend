"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admission_1 = require("../controllers/admissions/admission");
const router = express_1.default.Router();
router.post('/referadmission/:id', admission_1.referadmission);
router.get('/getallreferedforadmission/:ward', admission_1.getallreferedforadmission);
router.put('/updateadmissionstatus/:id', admission_1.updateadmissionstatus);
// admission from doctor
router.get('/getalladmissionbypatient/:patient', admission_1.getalladmissionbypatient);
//getalladmissionbypatient
exports.default = router;
