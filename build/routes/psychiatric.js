"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//createPsychiatricEvaluationController
const express_1 = __importDefault(require("express"));
const psychiatric_1 = require("../controllers/psychiatric/psychiatric");
const router = express_1.default.Router();
router.post('/createpsychiatricevaluation/:id', psychiatric_1.createPsychiatricEvaluationController);
router.put('/updatepsychiatric/:id', psychiatric_1.updatePsychiatricEvaluationController);
router.get('/readallpsychiatricbypatient/:patient', psychiatric_1.readAllPsychiatricByPatient);
//readOnePsychiatricEvaluationController
router.get('/readonepsychiatric/:id', psychiatric_1.readOnePsychiatricEvaluationController);
exports.default = router;
