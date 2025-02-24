"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//scheduleappointment
const express_1 = __importDefault(require("express"));
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
const appointment_1 = require("../controllers/appointment/appointment");
const router = express_1.default.Router();
router.post('/scheduleappointment', appointment_1.scheduleappointment);
router.get('/getallschedules', appointment_1.getAllSchedules);
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
exports.default = router;
