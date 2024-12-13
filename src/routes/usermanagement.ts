import express from 'express';
import {getallusers,updateusers} from '../controllers/usermanagment/usermanagement';
const router = express.Router();



router.get('/getallusers',getallusers);
router.put('/updateusers/:id', updateusers);
//updateusers


export default router;
