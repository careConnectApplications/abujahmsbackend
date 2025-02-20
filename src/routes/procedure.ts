//
//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
import {scheduleprocedureorder,readAllprocedureByPatient,updateprocedures,uploadprocedureresult} from '../controllers/procedure/procedure';
const router = express.Router();



router.post('/scheduleprocedureorder/:id', scheduleprocedureorder);
router.get('/readallprocedurebypatient/:id', readAllprocedureByPatient);
router.put('/updateprocedure/:id', updateprocedures);
router.post('/uploadprocedureresult/:id',uploadprocedureresult);
//uploadradiologyresult









export default router;
