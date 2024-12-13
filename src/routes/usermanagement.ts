import express from 'express';
import {getallusers,updateusers,updatestatus} from '../controllers/usermanagment/usermanagement';
const router = express.Router();



router.get('/getallusers',getallusers);
router.put('/updateusers/:id', updateusers);
router.put('/updatestatus/:id', updatestatus);
//updateusers


export default router;
