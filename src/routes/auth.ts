import express from 'express';
import {protect} from "../utils/middleware";
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
import {signup, signin,settings} from '../controllers/auth/auth';
const router = express.Router();


router.post('/signup', signup);
router.post('/signin',signin);
router.get('/settings',settings);


export default router;
