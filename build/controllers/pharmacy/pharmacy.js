"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispense = exports.readallpharmacytransactionbypartient = exports.readallpharmacytransaction = exports.pharmacyorder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otherservices_1 = require("../../utils/otherservices");
const config_1 = __importDefault(require("../../config"));
const price_1 = require("../../dao/price");
const patientmanagement_1 = require("../../dao/patientmanagement");
const payment_1 = require("../../dao/payment");
const prescription_1 = require("../../dao/prescription");
const appointment_1 = require("../../dao/appointment");
const { ObjectId } = mongoose_1.default.Types;
//pharmacy order
var pharmacyorder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.user);
        const { firstName, lastName } = (req.user).user;
        //accept _id from request
        const { id } = req.params;
        var { products, prescriptionnote, pharmacy, appointmentid } = req.body;
        var orderid = String(Date.now());
        var pharcyorderid = [];
        var paymentids = [];
        (0, otherservices_1.validateinputfaulsyvalue)({ id, products, pharmacy });
        //search patient
        var patient = yield (0, patientmanagement_1.readonepatient)({ _id: id, status: config_1.default.status[1] }, {}, '', '');
        if (!patient) {
            throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit} or has not made payment for registration`);
        }
        var appointment;
        if (appointmentid) {
            appointmentid = new ObjectId(appointmentid);
            appointment = yield (0, appointment_1.readoneappointment)({ _id: appointmentid }, {}, '');
            if (!appointment) {
                //create an appointment
                throw new Error(`Appointment donot ${config_1.default.error.erroralreadyexit}`);
            }
        }
        else {
            appointment = {
                _id: id,
                appointmentid: String(Date.now())
            };
        }
        //loop through all test and create record in lab order
        for (var i = 0; i < products.length; i++) {
            //    console.log(testname[i]);
            var orderPrice = yield (0, price_1.readoneprice)({ servicetype: products[i], servicecategory: config_1.default.category[1], pharmacy });
            if (!orderPrice) {
                throw new Error(`${config_1.default.error.errornopriceset} ${products[i]}`);
            }
            if (orderPrice.qty <= 0) {
                throw new Error(`${products[i]} ${config_1.default.error.erroravailability}`);
            }
            var amount = patient.isHMOCover == config_1.default.ishmo[1] ? Number(orderPrice.amount) * config_1.default.hmodrugpayment : Number(orderPrice.amount);
            var createpaymentqueryresult = yield (0, payment_1.createpayment)({ paymentreference: orderid, paymentype: products[i], paymentcategory: config_1.default.category[1], patient: patient._id, amount });
            //create 
            console.log("got here");
            var prescriptionrecord = yield (0, prescription_1.createprescription)({ pharmacy, prescription: products[i], patient: patient._id, payment: createpaymentqueryresult._id, orderid, prescribersname: firstName + " " + lastName, prescriptionnote, appointment: appointment._id, appointmentid: appointment.appointmentid });
            console.log(prescriptionrecord);
            pharcyorderid.push(prescriptionrecord._id);
            paymentids.push(createpaymentqueryresult._id);
        }
        var queryresult = yield (0, patientmanagement_1.updatepatient)(patient._id, { $push: { prescription: pharcyorderid, payment: paymentids } });
        res.status(200).json({ queryresult: prescriptionrecord, status: true });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.pharmacyorder = pharmacyorder;
//get all pharmacy order
const readallpharmacytransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //extract staff department
        const { clinic } = (req.user).user;
        const queryresult = yield (0, prescription_1.readallprescription)({ pharmacy: clinic }, {}, 'patient', 'appointment', 'payment');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readallpharmacytransaction = readallpharmacytransaction;
//get all pharmacy order
const readallpharmacytransactionbypartient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patient } = req.params;
        const queryresult = yield (0, prescription_1.readallprescription)({ patient }, {}, 'patient', 'appointment', 'payment');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readallpharmacytransactionbypartient = readallpharmacytransactionbypartient;
//get all pharmacy order
const dispense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //dispense
        //search product in inventory
        var response = yield (0, prescription_1.readoneprescription)({ _id: id }, {}, '', '', '');
        console.log('response', response);
        //check product status
        if (response.dispensestatus !== config_1.default.status[10]) {
            throw new Error(`Dispense ${config_1.default.error.errortasknotpending}`);
        }
        //check payment status
        var paymentrecord = yield (0, payment_1.readonepayment)({ _id: response.payment });
        if (paymentrecord.status !== config_1.default.status[3]) {
            throw new Error(config_1.default.error.errorpayment);
        }
        // console.log(testname[i]);
        var orderPrice = yield (0, price_1.readoneprice)({ servicetype: response.prescription, servicecategory: config_1.default.category[1] });
        if (!orderPrice) {
            throw new Error(config_1.default.error.errornopriceset);
        }
        if (orderPrice.qty <= 0) {
            throw new Error(`${response.prescription} ${config_1.default.error.erroravailability}`);
        }
        //reduce the quantity
        yield (0, price_1.updateprice)({ _id: orderPrice._id }, { qty: Number(orderPrice.qty) - 1 });
        //change status 6
        var queryresult = yield (0, prescription_1.updateprescription)({ _id: response._id }, { dispensestatus: config_1.default.status[6] });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.dispense = dispense;
