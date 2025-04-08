import express from 'express';
import {getallusers,updateusers,updatestatus,bulkuploadusers,passwordreset,updatepassword} from '../controllers/usermanagment/usermanagement';
const router = express.Router();



router.get('/getallusers',getallusers);
router.put('/updateusers/:id', updateusers);
router.put('/updatepassword/:id', updatepassword);
router.put('/updatestatus/:id', updatestatus);
router.post('/bulkuploadusers', bulkuploadusers);
router.post('/passwordreset/:id', passwordreset);
//updatepassword

//updateusers


export default router;
