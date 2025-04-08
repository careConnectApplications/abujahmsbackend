"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const anc_1 = require("../controllers/anc/anc");
const anc2_1 = require("../controllers/anc2/anc2");
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
exports.default = router;
