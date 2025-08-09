//createPsychiatricEvaluationController
import express from 'express';
import {protect} from "../utils/middleware";
import {createPsychiatricEvaluationController,readAllPsychiatricByPatient,updatePsychiatricEvaluationController,readOnePsychiatricEvaluationController} from '../controllers/psychiatric/psychiatric';
const router = express.Router();


router.post('/createpsychiatricevaluation/:id', createPsychiatricEvaluationController);
router.put('/updatepsychiatric/:id', updatePsychiatricEvaluationController);
router.get('/readallpsychiatricbypatient/:patient', readAllPsychiatricByPatient);
//readOnePsychiatricEvaluationController
router.get('/readonepsychiatric/:id', readOnePsychiatricEvaluationController);



export default router;

