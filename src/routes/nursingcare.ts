import express from 'express';
import {protect} from "../utils/middleware";
import {createvitalchart,readAllvitalsByPatient,readallvitalchartByAdmission,updatevitalchart} from '../controllers/vitalcharts/vitalcharts';
import {createmedicationchart,readAllmedicationByPatient,readallmedicationchartByAdmission,updatemedicalchart} from '../controllers/medicationcharts/medicationcharts';
import {createprogressreport,readAllprogressreportByPatient,readallprogressreportByAdmission,updateprogressreport} from '../controllers/progressreport/progressreport';
import {createinsulin,readAllinsulinByPatient,readallinsulinByAdmission,updateinsulin} from '../controllers/insulin/insulin';
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

//insulin chart
router.post('/createinsulin/:id', createinsulin);
router.get('/readallinsulinByAdmission/:admission', readallinsulinByAdmission);
router.get('/readAllinsulinByPatient/:patient', readAllinsulinByPatient);
router.put('/updateinsulin/:id', updateinsulin);





export default router;

