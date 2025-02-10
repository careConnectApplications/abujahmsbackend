import express from 'express';
import {protect} from "../utils/middleware";
import {createvitalchart,readAllvitalsByPatient,readallvitalchartByAdmission} from '../controllers/vitalcharts/vitalcharts';
const router = express.Router();

router.post('/createvitalchart/:id', createvitalchart);
router.get('/readallvitalchartbyadmission/:admission', readallvitalchartByAdmission);
router.get('/readAllvitalsbypatient/:patient', readAllvitalsByPatient);

export default router;

