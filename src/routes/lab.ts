//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
import {readalllabb,readAllLabByPatient,labresultprocessing,readallscheduledlab} from '../controllers/lab/lab';
const router = express.Router();



router.get('/readalllabb', readalllabb);
router.get('/readallscheduledlab', readallscheduledlab);
router.get('/readlabbypatientid/:id', readAllLabByPatient);
router.put('/labresultprocessing/:id', labresultprocessing);







export default router;
