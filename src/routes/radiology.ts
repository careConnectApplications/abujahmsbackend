//
//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
import {radiologyorder,readAllRadiologyByPatient,updateradiologys,uploadradiologyresult,readAllRadiology,confirmradiologyorder,enterradiologyresult,readAllRadiologyoptimized} from '../controllers/radiology/radiology';
const router = express.Router();



router.post('/radiologyorder/:id', radiologyorder);
router.get('/readallradiologybypatient/:id', readAllRadiologyByPatient);
router.get('/readallradiology', readAllRadiology);
router.get('/readallradiologyoptimized', readAllRadiologyoptimized);
router.put('/updateradiology/:id', updateradiologys);
router.put('/confirmradiologyorder/:id', confirmradiologyorder);
//confirmradiologyorder
router.post('/uploadradiologyresult/:id',uploadradiologyresult);
router.post('/enterradiologyresult/:id', enterradiologyresult);
//uploadradiologyresult









export default router;
