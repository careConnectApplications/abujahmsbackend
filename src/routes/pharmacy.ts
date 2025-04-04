import express from 'express';
import {bulkuploadinventory,getallpharmacystock,getallpharmacystockbyphamarcy,createstock,updatestocks} from '../controllers/inventory/stock';
import {pharmacyorder,readallpharmacytransaction,dispense,readallpharmacytransactionbypartient,confirmpharmacyorder,getpriceofdrug,groupreadallpharmacytransaction,readpharmacybyorderid,confirmpharmacygrouporder} from '../controllers/pharmacy/pharmacy';
const router = express.Router();



//router.get('/getallusers',getallusers);
//router.put('/updateusers/:id', updateusers);
//router.put('/updatestatus/:id', updatestatus);
router.post('/bulkstockupload', bulkuploadinventory);
router.get('/getallpharmacystock', getallpharmacystock);
router.get('/getallpharmacystockbyphamarcy/:clinic', getallpharmacystockbyphamarcy);
//getallpharmacystockbyphamarcy
router.post('/createstock', createstock);
router.put('/updatestocks/:id', updatestocks);
//pharmacy
router.post('/pharmacyorder/:id', pharmacyorder);
router.put('/confirmpharmacyorder/:id', confirmpharmacyorder);
//confirmpharmacyorder
router.get('/readallpharmacytransaction', readallpharmacytransaction);
router.put('/dispense/:id', dispense);

router.get('/readallpharmacytransactionbypartient/:patient', readallpharmacytransactionbypartient);
router.get('/getpriceofdrug/:id', getpriceofdrug);
//pharmacy grouping 
router.get('/groupreadallpharmacytransaction', groupreadallpharmacytransaction);
router.get('/readpharmacybyorderid/:orderid', readpharmacybyorderid);
//confirmpharmacygrouporder
router.put('/confirmpharmacygrouporder', confirmpharmacygrouporder);


//updateusers


export default router;
