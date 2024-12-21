//scheduleappointment
import express from 'express';
import {protect} from "../utils/middleware";
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
import {scheduleappointment} from '../controllers/appointment/appointment';
const router = express.Router();


router.post('/scheduleappointment/:id', scheduleappointment);



export default router;
