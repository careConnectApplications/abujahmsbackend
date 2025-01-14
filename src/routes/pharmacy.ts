import express from 'express';
import {bulkuploadinventory} from '../controllers/inventory/stock';
const router = express.Router();



//router.get('/getallusers',getallusers);
//router.put('/updateusers/:id', updateusers);
//router.put('/updatestatus/:id', updatestatus);
router.post('/bulkuploadinventory', bulkuploadinventory);

//updateusers


export default router;
