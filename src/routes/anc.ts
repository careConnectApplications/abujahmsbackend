import express from 'express';
import {protect} from "../utils/middleware";
import { updateancs, createancs, readAllancByPatient,readAllancfollowupByAnc,createancfollowups,updateancfollowups} from '../controllers/anc/anc';
const router = express.Router();


router.post('/createanc/:id', createancs);
router.put('/updateancs/:id', updateancs);
router.get('/readallancbypatient/:patient', readAllancByPatient);
////////acn followup //////////////////////
router.post('/createancfollowups/:anc', createancfollowups);
router.put('/updateancfollowups/:id', updateancfollowups);
router.get('/readallancfollowupbyanc/:anc', readAllancfollowupByAnc);


export default router;

