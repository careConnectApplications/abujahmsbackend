import express from 'express';
import {readbillinghistoryforapatient} from '../controllers/paymentandbilling/paymentandbilling';
const router = express.Router();



router.get('/getpatientbillinghistory/:id',readbillinghistoryforapatient);





export default router;



//readbillinghistoryforapatient