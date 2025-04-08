import express from 'express';
import {protect} from "../utils/middleware";
import {refertheatreadmission,getallreferedfortheatreadmission,updatetheatreadmissionstatus,getalltheatreadmissionbypatient,gettheatreadmissiontoday} from '../controllers/thearteadmission/thearteadmission';
const router = express.Router();


router.post('/refertheatreadmission/:id', refertheatreadmission);
router.get('/getallreferedfortheatreadmission/:theatre', getallreferedfortheatreadmission);
router.put('/updatetheatreadmissionstatus/:id', updatetheatreadmissionstatus);
// admission from doctor
router.get('/getalltheatreadmissionbypatient/:patient', getalltheatreadmissionbypatient);
router.get('/gettheatreadmissiontoday', gettheatreadmissiontoday);
//gettheatreadmissiontoday


export default router;

