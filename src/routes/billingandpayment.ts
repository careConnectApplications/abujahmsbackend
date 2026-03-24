import express from 'express';
<<<<<<< HEAD
import {readbillinghistoryforapatient,readbillinghistoryforallapatient,confirmpayment,printreceipt,groupreadallpayment,readpaymentbyreferencenumber,confirmgrouppayment,groupreadallpaymentoptimized,getCashierTotal, CreateBilingRecord,payAnnualSubscription} from '../controllers/paymentandbilling/paymentandbilling';
=======
import {readbillinghistoryforapatient,readbillinghistoryforallapatient,confirmpayment,printreceipt,groupreadallpayment,readpaymentbyreferencenumber,confirmgrouppayment,groupreadallpaymentoptimized,getCashierTotal, CreateBilingRecord} from '../controllers/paymentandbilling/paymentandbilling';
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
//pay for subscription
router.post("/payannualsubscription", payAnnualSubscription);
//getCashierTotal
router.get('/getcashiertotal',getCashierTotal);
router.post("/:patientId", CreateBilingRecord);

//payAnnualSubscription
=======
//getCashierTotal
router.get('/getcashiertotal',getCashierTotal);
router.post("/:patientId", CreateBilingRecord);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109






export default router;



//readbillinghistoryforapatient