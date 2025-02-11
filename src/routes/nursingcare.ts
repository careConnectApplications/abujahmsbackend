import express from 'express';
import {protect} from "../utils/middleware";
import {createvitalchart,readAllvitalsByPatient,readallvitalchartByAdmission,updatevitalchart} from '../controllers/vitalcharts/vitalcharts';
import {createmedicationchart,readAllmedicationByPatient,readallmedicationchartByAdmission,updatemedicalchart} from '../controllers/medicationcharts/medicationcharts';
const router = express.Router();

router.post('/createvitalchart/:id', createvitalchart);
router.get('/readallvitalchartbyadmission/:admission', readallvitalchartByAdmission);
router.get('/readAllvitalsbypatient/:patient', readAllvitalsByPatient);
router.put('/updatevitalchart/:id', updatevitalchart);


//medical charts
router.post('/createmedicationchart/:id', createmedicationchart);
router.get('/readallmedicationchartByAdmission/:admission', readallmedicationchartByAdmission);
router.get('/readAllmedicationchartsByPatient/:patient', readAllmedicationByPatient);
router.put('/updatemedicalchart/:id', updatemedicalchart);



export default router;

