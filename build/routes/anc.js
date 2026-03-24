"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
<<<<<<< HEAD
const anc3_1 = require("../controllers/anc3/anc3");
const router = express_1.default.Router();
router.post('/createancv3/:id', anc3_1.createAbujaAnc);
router.post("/:id", anc3_1.createAbujaAnc);
router.put('/updateancsv3/:id', anc3_1.updateAbujaAnc);
=======
const anc_1 = require("../controllers/anc/anc");
const anc2_1 = require("../controllers/anc2/anc2");
const anc3_1 = require("../controllers/anc3/anc3");
const router = express_1.default.Router();
router.post('/createanc/:id', anc_1.createancs);
router.put('/updateancs/:id', anc_1.updateancs);
router.get('/readallancbypatient/:patient', anc_1.readAllancByPatient);
////////acn followup //////////////////////
router.post('/createancfollowups/:anc', anc_1.createancfollowups);
router.put('/updateancfollowups/:id', anc_1.updateancfollowups);
router.get('/readallancfollowupbyanc/:anc', anc_1.readAllancfollowupByAnc);
///////version 2 ////////////////////////////////////////
router.post('/createancv2/:id', anc2_1.createancsv2);
router.put('/updateancsv2/:id', anc2_1.updateancsv2);
router.get('/readallancbypatientv2/:patient', anc2_1.readAllancByPatientv2);
////////acn followup //////////////////////
router.post('/createancfollowupsv2/:anc', anc2_1.createancfollowupsv2);
router.put('/updateancfollowupsv2/:id', anc2_1.updateancfollowupsv2);
router.get('/readallancfollowupbyancv2/:anc', anc2_1.readAllancfollowupByAncv2);
/////////////////// version 3 /////////////////////////
router.post('/createancv3/:id', anc3_1.createancsv3);
router.put('/updateancsv3/:id', anc3_1.updateancsv3);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
router.get('/readallancbypatientv3/:patient', anc3_1.readAllancByPatientv3);
//////////////////////anc followup ////////////////////////////////
router.post('/createancfollowupsv3/:anc', anc3_1.createancfollowupsv3);
router.put('/updateancfollowupsv3/:id', anc3_1.updateancfollowupsv3);
router.get('/readallancfollowupbyancv3/:anc', anc3_1.readAllancfollowupByAncv3);
<<<<<<< HEAD
// router.post('/createanc/:id', createancs);
// router.put('/updateancs/:id', updateancs);
// router.get('/readallancbypatient/:patient', readAllancByPatient);
// ////////acn followup //////////////////////
// router.post('/createancfollowups/:anc', createancfollowups);
// router.put('/updateancfollowups/:id', updateancfollowups);
// router.get('/readallancfollowupbyanc/:anc', readAllancfollowupByAnc);
// ///////version 2 ////////////////////////////////////////
// router.post('/createancv2/:id', createancsv2);
// router.put('/updateancsv2/:id', updateancsv2);
// router.get('/readallancbypatientv2/:patient', readAllancByPatientv2);
// ////////acn followup //////////////////////
// router.post('/createancfollowupsv2/:anc', createancfollowupsv2);
// router.put('/updateancfollowupsv2/:id', updateancfollowupsv2);
// router.get('/readallancfollowupbyancv2/:anc', readAllancfollowupByAncv2);
/////////////////// version 3 /////////////////////////
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
exports.default = router;
