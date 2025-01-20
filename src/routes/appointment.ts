//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
import {scheduleappointment,getAllSchedules,updateappointments,getAllSchedulesByPatient,getAllPaidSchedules,getAllPaidSchedulesByPatient,getAllPaidQueueSchedules,examinepatient, laborder,addencounter,getAllVtalsByPatient,getAllCompletedEncounter,getAllInProgressEncounter} from '../controllers/appointment/appointment';
const router = express.Router();


router.post('/scheduleappointment', scheduleappointment);
router.get('/getallschedules', getAllSchedules);
router.get('/getallschedulesbypatient/:id', getAllSchedulesByPatient);
router.put('/updateappointment/:id', updateappointments);
//////////doctors end ///////////////////
//getAllPaidSchedules
router.get('/getallmedicalhistory', getAllPaidSchedules);
router.get('/singlepatientmedicalhistory/:id', getAllPaidSchedulesByPatient);
router.get('/queue', getAllPaidQueueSchedules);
router.put('/examinepatient/:id', examinepatient);
router.post('/laborder/:id', laborder);
//vitals
router.post('/addencounter/:id', addencounter);
router.get('/singlepatientvital/:id', getAllVtalsByPatient);
/////////////complete, inprogress encounter/////////////////
router.get('/getallcompletedencounter/:id', getAllCompletedEncounter);
router.get('/getallinprogressencounter/:id', getAllInProgressEncounter);






export default router;
