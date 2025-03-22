"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
//scheduleappointment
const express_1 = __importDefault(require("express"));
const radiology_1 = require("../controllers/radiology/radiology");
const router = express_1.default.Router();
router.post('/radiologyorder/:id', radiology_1.radiologyorder);
router.get('/readallradiologybypatient/:id', radiology_1.readAllRadiologyByPatient);
router.get('/readallradiology', radiology_1.readAllRadiology);
router.put('/updateradiology/:id', radiology_1.updateradiologys);
router.put('/confirmradiologyorder/:id', radiology_1.confirmradiologyorder);
//confirmradiologyorder
router.post('/uploadradiologyresult/:id', radiology_1.uploadradiologyresult);
//uploadradiologyresult
exports.default = router;
