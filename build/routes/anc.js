"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const anc3_1 = require("../controllers/anc3/anc3");
const router = express_1.default.Router();
router.post('/createancv3/:id', anc3_1.createAbujaAnc);
router.post("/:id", anc3_1.createAbujaAnc);
router.put('/updateancsv3/:id', anc3_1.updateancsv3);
router.get('/readallancbypatientv3/:patient', anc3_1.readAllancByPatientv3);
//////////////////////anc followup ////////////////////////////////
router.post('/createancfollowupsv3/:anc', anc3_1.createancfollowupsv3);
router.put('/updateancfollowupsv3/:id', anc3_1.updateancfollowupsv3);
router.get('/readallancfollowupbyancv3/:anc', anc3_1.readAllancfollowupByAncv3);
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
exports.default = router;
