import express from 'express';
import {bulkuploadinventory,getallpharmacystock,createstock,updatestocks} from '../controllers/inventory/stock';
const router = express.Router();



//router.get('/getallusers',getallusers);
//router.put('/updateusers/:id', updateusers);
//router.put('/updatestatus/:id', updatestatus);
router.post('/bulkstockupload', bulkuploadinventory);
router.get('/getallpharmacystock', getallpharmacystock);
router.post('/createstock', createstock);
router.put('/updatestocks/:id', updatestocks);


//updateusers


export default router;
