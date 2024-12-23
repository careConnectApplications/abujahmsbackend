//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
import {scheduleappointment,getAllSchedules,updateappointments,getAllSchedulesByPatient,getAllPaidSchedules,getAllPaidSchedulesByPatient} from '../controllers/appointment/appointment';
const router = express.Router();


router.post('/scheduleappointment', scheduleappointment);
router.get('/getallschedules', getAllSchedules);
router.get('/getallschedulesbypatient/:id', getAllSchedulesByPatient);
router.put('/updateappointment/:id', updateappointments);
//////////doctors end ///////////////////
//getAllPaidSchedules
router.get('/getallmedicalhistory', getAllPaidSchedules);
router.get('/singlepatientmedicalhistory/:id', getAllPaidSchedulesByPatient);




export default router;
