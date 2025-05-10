//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
import {readalllabb,readAllLabByPatient,labresultprocessing,readallscheduledlab,listlabreport,printlabreport,listlabreportbypatient,confirmlaborder,readallscheduledlaboptimized} from '../controllers/lab/lab';
const router = express.Router();



router.get('/readalllabb', readalllabb);
router.get('/readallscheduledlab', readallscheduledlab);
router.get('/readallscheduledlaboptimized', readallscheduledlaboptimized);
router.get('/readlabbypatientid/:id', readAllLabByPatient);
router.put('/labresultprocessing/:id', labresultprocessing);
router.put('/confirmlaborder/:id', confirmlaborder);
//confirmlaborder
//labreport
router.get('/listlabreport', listlabreport);
router.get('/printlabreport/:id', printlabreport);
router.get('/listlabreportbypatient/:id', listlabreportbypatient);








export default router;
