import express from 'express';
import {protect} from "../utils/middleware";
import {referadmission,getallreferedforadmission,updateadmissionstatus,getalladmissionbypatient} from '../controllers/admissions/admission';
const router = express.Router();


router.post('/referadmission/:id', referadmission);
router.get('/getallreferedforadmission/:ward', getallreferedforadmission);
router.put('/updateadmissionstatus/:id', updateadmissionstatus);
// admission from doctor
router.get('/getalladmissionbypatient/:patient', getalladmissionbypatient);
//getalladmissionbypatient


export default router;

