import express from 'express';
//import {registration,login,updatestatus,getallusers,getusertypes} from '../controllers/user';
import {getallusers} from '../controllers/usermanagment/usermanagement';
const router = express.Router();



router.get('/getallusers',getallusers);


export default router;
