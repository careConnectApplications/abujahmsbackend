import express from 'express';
import {readbillinghistoryforapatient,readbillinghistoryforallapatient,confirmpayment,printreceipt,groupreadallpayment,readpaymentbyreferencenumber,confirmgrouppayment,groupreadallpaymentoptimized,getCashierTotal, CreateBilingRecord,payAnnualSubscription} from '../controllers/paymentandbilling/paymentandbilling';
const router = express.Router();



router.get('/getpatientbillinghistory/:id',readbillinghistoryforapatient);
router.get('/printreceipt/:paymentreference',printreceipt);
router.get('/getallpatientbillinghistory',readbillinghistoryforallapatient);
router.put('/confirmpayment/:id',confirmpayment);
router.get('/groupreadallpayment/:status?',groupreadallpayment);
//groupreadallpaymentoptimized
router.get('/groupreadallpaymentoptimized',groupreadallpaymentoptimized);
router.get('/readpaymentbyreferencenumber/:paymentreference',readpaymentbyreferencenumber);
router.put('/confirmgrouppayment/:paymentreferenceid',confirmgrouppayment);
//pay for subscription
router.post("/payannualsubscription", payAnnualSubscription);
//getCashierTotal
router.get('/getcashiertotal',getCashierTotal);
router.post("/:patientId", CreateBilingRecord);

//payAnnualSubscription






export default router;



//readbillinghistoryforapatient