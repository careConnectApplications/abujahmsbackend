//
//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
import {scheduleprocedureorder,readAllprocedureByPatient,updateprocedures,uploadprocedureresult,readAllprocedureByClinic} from '../controllers/procedure/procedure';
const router = express.Router();



router.post('/scheduleprocedureorder/:id', scheduleprocedureorder);
router.get('/readallprocedurebypatient/:id', readAllprocedureByPatient);
router.get('/readallprocedurebyclinic/:clinic', readAllprocedureByClinic);
router.put('/updateprocedure/:id', updateprocedures);
router.post('/uploadprocedureresult/:id',uploadprocedureresult);
//readAllprocedureByClinic
//uploadradiologyresult









export default router;
