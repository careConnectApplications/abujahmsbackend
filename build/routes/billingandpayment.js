"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentandbilling_1 = require("../controllers/paymentandbilling/paymentandbilling");
const router = express_1.default.Router();
router.get('/getpatientbillinghistory/:id', paymentandbilling_1.readbillinghistoryforapatient);
router.get('/printreceipt/:paymentreference', paymentandbilling_1.printreceipt);
router.get('/getallpatientbillinghistory', paymentandbilling_1.readbillinghistoryforallapatient);
router.put('/confirmpayment/:id', paymentandbilling_1.confirmpayment);
router.get('/groupreadallpayment/:status?', paymentandbilling_1.groupreadallpayment);
//groupreadallpaymentoptimized
router.get('/groupreadallpaymentoptimized', paymentandbilling_1.groupreadallpaymentoptimized);
router.get('/readpaymentbyreferencenumber/:paymentreference', paymentandbilling_1.readpaymentbyreferencenumber);
router.put('/confirmgrouppayment/:paymentreferenceid', paymentandbilling_1.confirmgrouppayment);
exports.default = router;
//readbillinghistoryforapatient
