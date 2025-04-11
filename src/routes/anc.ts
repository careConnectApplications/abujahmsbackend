import express from 'express';
import {protect} from "../utils/middleware";
import { updateancs, createancs, readAllancByPatient,readAllancfollowupByAnc,createancfollowups,updateancfollowups} from '../controllers/anc/anc';
import { updateancsv2, createancsv2, readAllancByPatientv2,readAllancfollowupByAncv2,createancfollowupsv2,updateancfollowupsv2} from '../controllers/anc2/anc2';
const router = express.Router();


router.post('/createanc/:id', createancs);
router.put('/updateancs/:id', updateancs);
router.get('/readallancbypatient/:patient', readAllancByPatient);
////////acn followup //////////////////////
router.post('/createancfollowups/:anc', createancfollowups);
router.put('/updateancfollowups/:id', updateancfollowups);
router.get('/readallancfollowupbyanc/:anc', readAllancfollowupByAnc);

///////version 2 ////////////////////////////////////////
router.post('/createancv2/:id', createancsv2);
router.put('/updateancsv2/:id', updateancsv2);
router.get('/readallancbypatientv2/:patient', readAllancByPatientv2);
////////acn followup //////////////////////
router.post('/createancfollowupsv2/:anc', createancfollowupsv2);
router.put('/updateancfollowupsv2/:id', updateancfollowupsv2);
router.get('/readallancfollowupbyancv2/:anc', readAllancfollowupByAncv2);


export default router;

