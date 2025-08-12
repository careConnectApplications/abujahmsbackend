"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//scheduleappointment
const express_1 = __importDefault(require("express"));
const lab_1 = require("../controllers/lab/lab");
const router = express_1.default.Router();
router.get('/readalllabb', lab_1.readalllabb);
router.get('/readallscheduledlab', lab_1.readallscheduledlab);
router.get('/readallscheduledlaboptimized', lab_1.readallscheduledlaboptimized);
router.get('/readlabbypatientid/:id', lab_1.readAllLabByPatient);
router.put('/labresultprocessing/:id', lab_1.labresultprocessing);
router.put('/confirmlaborder/:id', lab_1.confirmlaborder);
//confirmlaborder
//labreport
router.get('/listlabreport', lab_1.listlabreport);
router.get('/printlabreport/:id', lab_1.printlabreport);
router.get('/listlabreportbypatient/:id', lab_1.listlabreportbypatient);
router.put('/sortbyhemathologyandchemicalpathology/:id', lab_1.sorthemathologyandchemicalpathology);
//readallscheduledlaboptimizedhemathologyandchemicalpathology
router.get('/readallscheduledlaboptimizedhemathologyandchemicalpathology', lab_1.readallscheduledlaboptimizedhemathologyandchemicalpathology);
router.put('/labresultprocessinghemathologychemicalpathology/:id', lab_1.labresultprocessinghemathologychemicalpathology);
exports.default = router;
