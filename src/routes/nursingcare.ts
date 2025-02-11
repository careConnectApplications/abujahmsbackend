import express from 'express';
import {protect} from "../utils/middleware";
import {createvitalchart,readAllvitalsByPatient,readallvitalchartByAdmission,updatevitalchart} from '../controllers/vitalcharts/vitalcharts';
import {createmedicationchart,readAllmedicationByPatient,readallmedicationchartByAdmission,updatemedicalchart} from '../controllers/medicationcharts/medicationcharts';
import {createprogressreport,readAllprogressreportByPatient,readallprogressreportByAdmission,updateprogressreport} from '../controllers/progressreport/progressreport';
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

//progress report
router.post('/createprogressreport/:id', createprogressreport);
router.get('/readallprogressreportByAdmission/:admission', readallprogressreportByAdmission);
router.get('/readAllprogressreportByPatient/:patient', readAllprogressreportByPatient);
router.put('/updateprogressreport/:id', updateprogressreport);




export default router;

