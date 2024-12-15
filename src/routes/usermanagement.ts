import express from 'express';
import {getallusers,updateusers,updatestatus,bulkuploadusers} from '../controllers/usermanagment/usermanagement';
const router = express.Router();



router.get('/getallusers',getallusers);
router.put('/updateusers/:id', updateusers);
router.put('/updatestatus/:id', updatestatus);
router.post('/bulkuploadusers', bulkuploadusers);

//updateusers


export default router;
