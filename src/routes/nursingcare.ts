import express from 'express';
import {protect} from "../utils/middleware";
import {createvitalchart,readAllvitalsByPatient,readallvitalchartByAdmission} from '../controllers/vitalcharts/vitalcharts';
import {createmedicationchart,readAllmedicationByPatient,readallmedicationchartByAdmission} from '../controllers/medicationcharts/medicationcharts';
const router = express.Router();

router.post('/createvitalchart/:id', createvitalchart);
router.get('/readallvitalchartbyadmission/:admission', readallvitalchartByAdmission);
router.get('/readAllvitalsbypatient/:patient', readAllvitalsByPatient);

//medical charts
router.post('/createmedicationchart/:id', createmedicationchart);
router.get('/readallmedicationchartByAdmission/:admission', readallmedicationchartByAdmission);
router.get('/readAllmedicationchartsByPatient/:patient', readAllmedicationByPatient);


export default router;

