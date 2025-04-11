//
//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
import {readAllreferrerByPatient,updatereferrers,createreferrers,acceptreferrers,scheduleappointment} from '../controllers/referrer/referrer';
const router = express.Router();



router.post('/createreferrers/:id', createreferrers);
router.get('/readallreferrerbypatient/:patient', readAllreferrerByPatient);
router.put('/updatereferrers/:id', updatereferrers);
router.post('/acceptreferrers/:id',acceptreferrers);
//scheduleappointment
router.put('/scheduleappointment/:id', scheduleappointment);










export default router;
