//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
import {scheduleappointment,getAllSchedules,updateappointments,getAllSchedulesByPatient} from '../controllers/appointment/appointment';
const router = express.Router();


router.post('/scheduleappointment/:id', scheduleappointment);
router.get('/getallschedules', getAllSchedules);
router.get('/getallschedulesbypatient/:id', getAllSchedulesByPatient);
router.put('/updateappointment/:id', updateappointments);




export default router;
