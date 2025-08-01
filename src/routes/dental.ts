//createPsychiatricEvaluationController
import express from 'express';
import {protect} from "../utils/middleware";

import {createDentalEncounterController,updateDentalEncounterController,readOneDentalEncounterController,readAllDentalByPatient} from '../controllers/dentalencounter/dentalencounter';
const router = express.Router();


router.post('/createdentalencounter/:id', createDentalEncounterController);
router.put('/updatedentalencounter/:id', updateDentalEncounterController);
router.get('/readalldentalbypatient/:patient', readAllDentalByPatient);
//readOnePsychiatricEvaluationController
router.get('/readonedentalencounter/:id', readOneDentalEncounterController);



export default router;

