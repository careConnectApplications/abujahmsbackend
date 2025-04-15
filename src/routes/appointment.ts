//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
import {scheduleappointment,getAllSchedules,updateappointments,getAllSchedulesByPatient,getAllPaidSchedules,getAllPaidSchedulesByPatient,getAllPaidQueueSchedules,examinepatient, laborder,addencounter,getAllVtalsByPatient,getAllCompletedEncounter,getAllInProgressEncounter,getAllPreviousEncounter,addclinicalencounter,getAllCompletedClinicalEncounter,getAllPreviousClininicalEncounter,getAllInProgressClinicalEncounter,readallvitalchartByAppointment,getAllSchedulesoptimized} from '../controllers/appointment/appointment';
const router = express.Router();


router.post('/scheduleappointment', scheduleappointment);
router.get('/getallschedules', getAllSchedules);
router.get('/getallschedulesoptimized', getAllSchedulesoptimized);
//getAllSchedulesoptimized
router.get('/readallvitalchartByAppointment/:id', readallvitalchartByAppointment);
//readallvitalchartByAppointment
router.get('/getallschedulesbypatient/:id', getAllSchedulesByPatient);
router.put('/updateappointment/:id', updateappointments);
//////////doctors end ///////////////////
//getAllPaidSchedules
router.get('/getallmedicalhistory/:clinic', getAllPaidSchedules);
router.get('/singlepatientmedicalhistory/:id', getAllPaidSchedulesByPatient);
router.get('/queue/:clinic', getAllPaidQueueSchedules);
router.put('/examinepatient/:id', examinepatient);
router.post('/laborder/:id', laborder);
//vitals
router.post('/addencounter/:id', addencounter);
router.get('/singlepatientvital/:id', getAllVtalsByPatient);
/////////////complete, inprogress encounter/////////////////
router.get('/getallcompletedencounter/:id', getAllCompletedEncounter);
router.get('/getallinprogressencounter/:id', getAllInProgressEncounter);
router.get('/getallpreviousencounter/:id', getAllPreviousEncounter);

// clinical encounter ////
router.post('/addclinicalencounter/:id', addclinicalencounter);
router.get('/getallcompletedclinicalencounter/:id', getAllCompletedClinicalEncounter);
router.get('/getallinprogressclinicalencounter/:id', getAllInProgressClinicalEncounter);
router.get('/getallpreviousclinicalencounter/:id', getAllPreviousClininicalEncounter);








export default router;
