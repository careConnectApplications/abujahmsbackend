"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//createPsychiatricEvaluationController
const express_1 = __importDefault(require("express"));
const physiotherapy_1 = require("../controllers/physiotherapy/physiotherapy");
const router = express_1.default.Router();
router.post('/createphysiotherapyassessments/:id', physiotherapy_1.createPhysiotherapyAssessments);
router.put('/updatephysiotherapyassessment/:id', physiotherapy_1.updatePhysiotherapyAssessment);
router.get('/readallphysiotherapyassessmentbypatient/:patient', physiotherapy_1.readAllPhysiotherapyAssessmentByPatient);
router.get('/readonephysiotherapyassessments/:id', physiotherapy_1.readOnePhysiotherapyAssessments);
exports.default = router;
