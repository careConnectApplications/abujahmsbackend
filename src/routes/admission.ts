import express from 'express';
<<<<<<< HEAD
import {protect, checkSubscription} from "../utils/middleware";
import {referadmission,getallreferedforadmission,updateadmissionstatus,getalladmissionbypatient,searchAdmissionRecords,addBedFee} from '../controllers/admissions/admission';
=======
import {protect} from "../utils/middleware";
import {referadmission,getallreferedforadmission,updateadmissionstatus,getalladmissionbypatient,searchAdmissionRecords} from '../controllers/admissions/admission';
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
const router = express.Router();


router.post('/referadmission/:id', checkSubscription,referadmission);
router.get('/getallreferedforadmission/:ward', getallreferedforadmission);
router.put('/updateadmissionstatus/:id', updateadmissionstatus);
// admission from doctor
router.get('/getalladmissionbypatient/:patient', getalladmissionbypatient);
//searchAdmissionRecords
router.get('/searchadmissionrecords', searchAdmissionRecords);
<<<<<<< HEAD
router.post('/addBedFee/:id', addBedFee);
//addBedFee
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109


export default router;

