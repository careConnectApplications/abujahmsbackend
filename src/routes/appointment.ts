//scheduleappointment
import express from 'express';
import {checkSubscription} from "../utils/middleware";
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
import {scheduleappointment,getAllSchedules,updateappointments,getAllSchedulesByPatient,getAllPaidSchedules,getAllPaidSchedulesByPatient,getAllPaidQueueSchedules,examinepatient, laborder,addencounter,getAllVtalsByPatient,getAllCompletedEncounter,getAllInProgressEncounter,getAllPreviousEncounter,addclinicalencounter,getAllCompletedClinicalEncounter,getAllPreviousClininicalEncounter,getAllInProgressClinicalEncounter,readallvitalchartByAppointment,getAllSchedulesoptimized,getAllPaidSchedulesoptimized,getDoctorsByClinic,assignDoctorToAppointment,countPatientsPerDoctor} from '../controllers/appointment/appointment';
const router = express.Router();

router.get('/getallmedicalhistoryoptimized/:clinic', getAllPaidSchedulesoptimized);
<<<<<<< HEAD
router.post('/scheduleappointment', checkSubscription, scheduleappointment);
=======
router.post('/scheduleappointment', scheduleappointment);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
///////////////////////////
router.get('/getdoctorsbyclinic/:clinic', getDoctorsByClinic);
router.post('/assigndoctortoappointment', assignDoctorToAppointment);
router.get('/countpatientsperdoctor/:clinic', countPatientsPerDoctor);







export default router;
