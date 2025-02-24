"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentandbilling_1 = require("../controllers/paymentandbilling/paymentandbilling");
const router = express_1.default.Router();
router.get('/getpatientbillinghistory/:id', paymentandbilling_1.readbillinghistoryforapatient);
router.get('/getallpatientbillinghistory', paymentandbilling_1.readbillinghistoryforallapatient);
router.put('/confirmpayment/:id', paymentandbilling_1.confirmpayment);
//readbillinghistoryforallapatient
exports.default = router;
//readbillinghistoryforapatient
