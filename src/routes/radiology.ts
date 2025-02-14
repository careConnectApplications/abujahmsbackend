//
//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
import {radiologyorder,readAllRadiologyByPatient,updateradiologys,uploadradiologyresult} from '../controllers/radiology/radiology';
const router = express.Router();



router.post('/radiologyorder/:id', radiologyorder);
router.get('/readallradiologybypatient/:id', readAllRadiologyByPatient);
router.put('/updateradiology/:id', updateradiologys);
router.post('/uploadradiologyresult/:id',uploadradiologyresult);
//uploadradiologyresult









export default router;
