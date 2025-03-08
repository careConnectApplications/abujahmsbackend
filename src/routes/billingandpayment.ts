import express from 'express';
import {readbillinghistoryforapatient,readbillinghistoryforallapatient,confirmpayment,printreceipt} from '../controllers/paymentandbilling/paymentandbilling';
const router = express.Router();



router.get('/getpatientbillinghistory/:id',readbillinghistoryforapatient);
router.get('/printreceipt/:paymentreference',printreceipt);
router.get('/getallpatientbillinghistory',readbillinghistoryforallapatient);
router.put('/confirmpayment/:id',confirmpayment);
//readbillinghistoryforallapatient





export default router;



//readbillinghistoryforapatient