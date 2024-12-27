//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
import {readalllabb,readAllLabByPatient} from '../controllers/lab/lab';
const router = express.Router();



router.get('/readalllabb', readalllabb);
router.get('/readlabbypatientid/:id', readAllLabByPatient);






export default router;
