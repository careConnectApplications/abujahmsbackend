"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//createPsychiatricEvaluationController
const express_1 = __importDefault(require("express"));
const dentalencounter_1 = require("../controllers/dentalencounter/dentalencounter");
const router = express_1.default.Router();
router.post('/createdentalencounter/:id', dentalencounter_1.createDentalEncounterController);
router.put('/updatedentalencounter/:id', dentalencounter_1.updateDentalEncounterController);
router.get('/readalldentalbypatient/:patient', dentalencounter_1.readAllDentalByPatient);
//readOnePsychiatricEvaluationController
router.get('/readonedentalencounter/:id', dentalencounter_1.readOneDentalEncounterController);
exports.default = router;
