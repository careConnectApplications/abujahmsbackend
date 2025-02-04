import express from 'express';
import {protect} from "../utils/middleware";
import {referadmission,getallreferedforadmission,updateadmissionstatus} from '../controllers/admissions/admission';
const router = express.Router();


router.post('/referadmission/:id', referadmission);
router.get('/getallreferedforadmission', getallreferedforadmission);
router.put('/updateadmissionstatus/:id', updateadmissionstatus);


export default router;

