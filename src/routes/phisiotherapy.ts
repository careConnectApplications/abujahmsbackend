//createPsychiatricEvaluationController
import express from 'express';
import {protect} from "../utils/middleware";

import {createPhysiotherapyAssessments,updatePhysiotherapyAssessment,readOnePhysiotherapyAssessments,readAllPhysiotherapyAssessmentByPatient} from '../controllers/physiotherapy/physiotherapy';
const router = express.Router();


router.post('/createphysiotherapyassessments/:id', createPhysiotherapyAssessments);
router.put('/updatephysiotherapyassessment/:id', updatePhysiotherapyAssessment);
router.get('/readallphysiotherapyassessmentbypatient/:patient', readAllPhysiotherapyAssessmentByPatient);
router.get('/readonephysiotherapyassessments/:id', readOnePhysiotherapyAssessments);



export default router;

