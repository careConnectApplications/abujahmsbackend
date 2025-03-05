import express from 'express';
import {bulkuploadinventory,getallpharmacystock,createstock,updatestocks} from '../controllers/inventory/stock';
import {pharmacyorder,readallpharmacytransaction,dispense,readallpharmacytransactionbypartient,confirmpharmacyorder} from '../controllers/pharmacy/pharmacy';
const router = express.Router();



//router.get('/getallusers',getallusers);
//router.put('/updateusers/:id', updateusers);
//router.put('/updatestatus/:id', updatestatus);
router.post('/bulkstockupload', bulkuploadinventory);
router.get('/getallpharmacystock', getallpharmacystock);
router.post('/createstock', createstock);
router.put('/updatestocks/:id', updatestocks);
//pharmacy
router.post('/pharmacyorder/:id', pharmacyorder);
router.put('/confirmpharmacyorder/:id', confirmpharmacyorder);
//confirmpharmacyorder
router.get('/readallpharmacytransaction', readallpharmacytransaction);
router.put('/dispense/:id', dispense);


//readallpharmacytransactionbypartient
router.get('/readallpharmacytransactionbypartient/:patient', readallpharmacytransactionbypartient);



//updateusers


export default router;
