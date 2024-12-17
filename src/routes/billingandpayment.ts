import express from 'express';
import {readbillinghistoryforapatient,readbillinghistoryforallapatient} from '../controllers/paymentandbilling/paymentandbilling';
const router = express.Router();



router.get('/getpatientbillinghistory/:id',readbillinghistoryforapatient);
router.get('/getallpatientbillinghistory',readbillinghistoryforallapatient);
//readbillinghistoryforallapatient





export default router;



//readbillinghistoryforapatient