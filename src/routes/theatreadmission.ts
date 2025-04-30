import express from 'express';
import {protect} from "../utils/middleware";
import {refertheatreadmission,getallreferedfortheatreadmission,updatetheatreadmissionstatus,getalltheatreadmissionbypatient,gettheatreadmissiontoday} from '../controllers/thearteadmission/thearteadmission';
import {fillconscentform,readconscentformbytheatreadmission,updatefillconscentform} from '../controllers/conscentodoperations/conscenttodoperations';
import {fillpreoperativeprevisitform, readpreoperativeprevisitformbytheatreadmission,updatefillpreoperativeprevisitform} from "../controllers/preoperativeprevisit/preoperativeprevisit";
const router = express.Router();


router.post('/refertheatreadmission/:id', refertheatreadmission);
router.get('/getallreferedfortheatreadmission/:theatre', getallreferedfortheatreadmission);
router.put('/updatetheatreadmissionstatus/:id', updatetheatreadmissionstatus);
// admission from doctor
router.get('/getalltheatreadmissionbypatient/:patient', getalltheatreadmissionbypatient);
router.get('/gettheatreadmissiontoday', gettheatreadmissiontoday);
//conscent
router.post('/fillconscentform/:theatreadmission', fillconscentform);
router.get('/readconscentformbytheatreadmission/:theatreadmission', readconscentformbytheatreadmission);
router.put('/updatefillconscentform/:id', updatefillconscentform);
//preoperative
router.post('/fillpreoperativeprevisitform/:theatreadmission', fillpreoperativeprevisitform);
router.get('/readpreoperativeprevisitformbytheatreadmission/:theatreadmission', readpreoperativeprevisitformbytheatreadmission);
router.put('/updatepreoperativeprevisitform/:id', updatefillpreoperativeprevisitform);


export default router;

