"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//scheduleappointment
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../utils/middleware");
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
const appointment_1 = require("../controllers/appointment/appointment");
const router = express_1.default.Router();
router.get('/getallmedicalhistoryoptimized/:clinic', appointment_1.getAllPaidSchedulesoptimized);
router.post('/scheduleappointment', middleware_1.checkSubscription, appointment_1.scheduleappointment);
router.get('/getallschedules', appointment_1.getAllSchedules);
router.get('/getallschedulesoptimized', appointment_1.getAllSchedulesoptimized);
//getAllSchedulesoptimized
router.get('/readallvitalchartByAppointment/:id', appointment_1.readallvitalchartByAppointment);
//readallvitalchartByAppointment
router.get('/getallschedulesbypatient/:id', appointment_1.getAllSchedulesByPatient);
router.put('/updateappointment/:id', appointment_1.updateappointments);
//////////doctors end ///////////////////
//getAllPaidSchedules
router.get('/getallmedicalhistory/:clinic', appointment_1.getAllPaidSchedules);
router.get('/singlepatientmedicalhistory/:id', appointment_1.getAllPaidSchedulesByPatient);
router.get('/queue/:clinic', appointment_1.getAllPaidQueueSchedules);
router.put('/examinepatient/:id', appointment_1.examinepatient);
router.post('/laborder/:id', appointment_1.laborder);
//vitals
router.post('/addencounter/:id', appointment_1.addencounter);
router.get('/singlepatientvital/:id', appointment_1.getAllVtalsByPatient);
/////////////complete, inprogress encounter/////////////////
router.get('/getallcompletedencounter/:id', appointment_1.getAllCompletedEncounter);
router.get('/getallinprogressencounter/:id', appointment_1.getAllInProgressEncounter);
router.get('/getallpreviousencounter/:id', appointment_1.getAllPreviousEncounter);
// clinical encounter ////
router.post('/addclinicalencounter/:id', appointment_1.addclinicalencounter);
router.get('/getallcompletedclinicalencounter/:id', appointment_1.getAllCompletedClinicalEncounter);
router.get('/getallinprogressclinicalencounter/:id', appointment_1.getAllInProgressClinicalEncounter);
router.get('/getallpreviousclinicalencounter/:id', appointment_1.getAllPreviousClininicalEncounter);
///////////////////////////
router.get('/getdoctorsbyclinic/:clinic', appointment_1.getDoctorsByClinic);
router.post('/assigndoctortoappointment', appointment_1.assignDoctorToAppointment);
router.get('/countpatientsperdoctor/:clinic', appointment_1.countPatientsPerDoctor);
exports.default = router;
