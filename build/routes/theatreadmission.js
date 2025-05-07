"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const thearteadmission_1 = require("../controllers/thearteadmission/thearteadmission");
const conscenttodoperations_1 = require("../controllers/conscentodoperations/conscenttodoperations");
const preoperativeprevisit_1 = require("../controllers/preoperativeprevisit/preoperativeprevisit");
const preanathetics_1 = require("../controllers/preanathetics/preanathetics");
const router = express_1.default.Router();
router.post('/refertheatreadmission/:id', thearteadmission_1.refertheatreadmission);
router.get('/getallreferedfortheatreadmission/:theatre', thearteadmission_1.getallreferedfortheatreadmission);
router.put('/updatetheatreadmissionstatus/:id', thearteadmission_1.updatetheatreadmissionstatus);
// admission from doctor
router.get('/getalltheatreadmissionbypatient/:patient', thearteadmission_1.getalltheatreadmissionbypatient);
router.get('/gettheatreadmissiontoday', thearteadmission_1.gettheatreadmissiontoday);
//conscent
router.post('/fillconscentform/:theatreadmission', conscenttodoperations_1.fillconscentform);
router.get('/readconscentformbytheatreadmission/:theatreadmission', conscenttodoperations_1.readconscentformbytheatreadmission);
router.put('/updatefillconscentform/:id', conscenttodoperations_1.updatefillconscentform);
//preoperative
router.post('/fillpreoperativeprevisitform/:theatreadmission', preoperativeprevisit_1.fillpreoperativeprevisitform);
router.get('/readpreoperativeprevisitformbytheatreadmission/:theatreadmission', preoperativeprevisit_1.readpreoperativeprevisitformbytheatreadmission);
router.put('/updatepreoperativeprevisitform/:id', preoperativeprevisit_1.updatefillpreoperativeprevisitform);
//preanatheticsform
router.post('/fillpreanatheticsform/:theatreadmission', preanathetics_1.fillpreanatheticsform);
router.get('/readpreanatheticsformbytheatreadmission/:theatreadmission', preanathetics_1.readpreanatheticsformbytheatreadmission);
router.put('/updatepreanatheticsconscentform/:id', preanathetics_1.updatepreanatheticsconscentform);
exports.default = router;
