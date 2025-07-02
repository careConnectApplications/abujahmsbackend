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
const anaethesia_1 = require("../controllers/anaethesia/anaethesia");
const postanaetheticrecoverychart_1 = require("../controllers/postanaetheticrecoverychart/postanaetheticrecoverychart");
const operationnotes_1 = require("../controllers/operationnotes/operationnotes");
const histologyrequest_1 = require("../controllers/histologyrequest/histologyrequest");
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
//anaethetic
router.post('/fillanaethesiaform/:theatreadmission', anaethesia_1.fillanaethesiaform);
router.get('/readreadanaethesiaformbytheatreadmission/:theatreadmission', anaethesia_1.readreadoneanaethesiaformbytheatreadmission);
router.put('/updateanaethesiaform/:id', anaethesia_1.updateanaethesiaform);
//drug given ///
router.post('/createdruggivens/:anathesia', anaethesia_1.createdruggivens);
router.get('/readalldruggivenByTheatreAdmission/:anathesia', anaethesia_1.readalldruggivenByTheatreAdmission);
router.put('/updatedruggivens/:id', anaethesia_1.updatedruggivens);
//food given ////
router.post('/createfoodgivens/:anathesia', anaethesia_1.createfoodgivens);
router.get('/readallfoodgivenByTheatreAdmission/:anathesia', anaethesia_1.readallfoodgivenByTheatreAdmission);
router.put('/updatefoodgivens/:id', anaethesia_1.updatefoodgivens);
//postanaethetic
router.post('/fillpostanaetheticrecoverychartform/:theatreadmission', postanaetheticrecoverychart_1.fillpostanaetheticrecoverychartform);
router.get('/readonepostanaetheticrecoverychartformbytheatreadmission/:theatreadmission', postanaetheticrecoverychart_1.readonepostanaetheticrecoverychartformbytheatreadmission);
router.put('/updatepostanaetheticrecoverychartform/:id', postanaetheticrecoverychart_1.updatepostanaetheticrecoverychartform);
//vital signs score ////
router.post('/createvitalsignscores/:postanaetheticrecoverychart', postanaetheticrecoverychart_1.createvitalsignscores);
router.get('/readallvitalsignscoreByTheatreAdmission/:postanaetheticrecoverychart', postanaetheticrecoverychart_1.readallvitalsignscoreByTheatreAdmission);
router.put('/updatevitalsignscores/:id', postanaetheticrecoverychart_1.updatevitalsignscores);
//operation note
router.post('/filloperationnote/:theatreadmission', operationnotes_1.filloperationnote);
router.get('/readoperationnotebytheatreadmission/:theatreadmission', operationnotes_1.readoperationnotebytheatreadmission);
router.put('/updatefilloperationnote/:id', operationnotes_1.updatefilloperationnote);
//histology request
router.post('/fillhistologyrequestform/:theatreadmission', histologyrequest_1.fillhistologyrequestform);
router.get('/readhistologyrequestformytheatreadmission/:theatreadmission', histologyrequest_1.readhistologyrequestformytheatreadmission);
router.put('/updatehistologyrequestform/:id', histologyrequest_1.updatehistologyrequestform);
exports.default = router;
