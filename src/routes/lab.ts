//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
<<<<<<< HEAD
import {readalllabb,readAllLabByPatient,labresultprocessing,readallscheduledlab,listlabreport,printlabreport,listlabreportbypatient,confirmlaborder,readallscheduledlaboptimized,sorthemathologyandchemicalpathology,readallscheduledlaboptimizedhemathologyandchemicalpathology,labresultprocessinghemathologychemicalpathology,validatelabresult} from '../controllers/lab/lab';
=======
import {readalllabb,readAllLabByPatient,labresultprocessing,readallscheduledlab,listlabreport,printlabreport,listlabreportbypatient,confirmlaborder,readallscheduledlaboptimized,sorthemathologyandchemicalpathology,readallscheduledlaboptimizedhemathologyandchemicalpathology,labresultprocessinghemathologychemicalpathology} from '../controllers/lab/lab';
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
const router = express.Router();



router.get('/readalllabb', readalllabb);
router.get('/readallscheduledlab', readallscheduledlab);
router.get('/readallscheduledlaboptimized', readallscheduledlaboptimized);
router.get('/readlabbypatientid/:id', readAllLabByPatient);
router.put('/labresultprocessing/:id', labresultprocessing);
router.put('/confirmlaborder/:id', confirmlaborder);
router.put('/validatelabresult/:id', validatelabresult);
//confirmlaborder
//labreport
router.get('/listlabreport', listlabreport);
router.get('/printlabreport/:id', printlabreport);
router.get('/listlabreportbypatient/:id', listlabreportbypatient);
<<<<<<< HEAD
//router.put('/sortbyhemathologyandchemicalpathology/:id', sorthemathologyandchemicalpathology);
=======
router.put('/sortbyhemathologyandchemicalpathology/:id', sorthemathologyandchemicalpathology);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
//readallscheduledlaboptimizedhemathologyandchemicalpathology
router.get('/readallscheduledlaboptimizedhemathologyandchemicalpathology', readallscheduledlaboptimizedhemathologyandchemicalpathology);
router.put('/labresultprocessinghemathologychemicalpathology/:id', labresultprocessinghemathologychemicalpathology);







export default router;
