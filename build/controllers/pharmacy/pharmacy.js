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
exports.getpriceofdrug = exports.dispense = exports.confirmpharmacyorder = exports.readallpharmacytransactionbypartient = exports.readallpharmacytransaction = exports.pharmacyorder = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otherservices_1 = require("../../utils/otherservices");
const config_1 = __importDefault(require("../../config"));
const price_1 = require("../../dao/price");
const patientmanagement_1 = require("../../dao/patientmanagement");
const payment_1 = require("../../dao/payment");
const prescription_1 = require("../../dao/prescription");
const appointment_1 = require("../../dao/appointment");
const admissions_1 = require("../../dao/admissions");
const { ObjectId } = mongoose_1.default.Types;
//pharmacy order
var pharmacyorder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //add more options  dosageform,strength,dosage,frequency
        //remove  payment from this 
        //add qty to the data base
        /*
        
        dosageform:String,
          strength:String,
          dosage:String,
          frequency:String,
          route:String,
        */
        console.log(req.user);
        const { firstName, lastName } = (req.user).user;
        //accept _id from request
        const { id } = req.params;
        var { products, appointmentid } = req.body;
        var orderid = String(Date.now());
        var pharcyorderid = [];
        //var paymentids =[];
        // validateinputfaulsyvalue({id, products,pharmacy});
        (0, otherservices_1.validateinputfaulsyvalue)({ id, products });
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
            let { dosageform, strength, dosage, frequency, route, drug, pharmacy, prescriptionnote } = products[i];
            //    console.log(testname[i]);
            //var orderPrice:any = await readoneprice({servicetype:products[i], servicecategory: configuration.category[1],pharmacy});
            /*
            var orderPrice:any = await readoneprice({servicetype:drug, servicecategory: configuration.category[1],pharmacy});
            
            if(!orderPrice){
              throw new Error(`${configuration.error.errornopriceset} ${products[i]}`);
          }
          if(orderPrice.qty <=0){
            throw new Error(`${products[i]} ${configuration.error.erroravailability}`);
    
          }
            */
            /*
            var amount =patient.isHMOCover == configuration.ishmo[1]?Number(orderPrice.amount) * configuration.hmodrugpayment:Number(orderPrice.amount);
            var createpaymentqueryresult =await createpayment({paymentreference:orderid,paymentype:products[i],paymentcategory:configuration.category[1],patient:patient._id,amount});
            */
            //create 
            console.log("got here");
            //var prescriptionrecord:any = await createprescription({pharmacy, prescription:products[i],patient:patient._id,payment:createpaymentqueryresult._id,orderid,prescribersname:firstName + " " + lastName,prescriptionnote,appointment:appointment._id,appointmentid:appointment.appointmentid});
            var prescriptionrecord = yield (0, prescription_1.createprescription)({ pharmacy, dosageform, strength, dosage, frequency, route, prescription: drug, patient: patient._id, orderid, prescribersname: firstName + " " + lastName, prescriptionnote, appointment: appointment._id, appointmentid: appointment.appointmentid });
            console.log(prescriptionrecord);
            pharcyorderid.push(prescriptionrecord._id);
            //paymentids.push(createpaymentqueryresult._id);
        }
        //var queryresult=await updatepatient(patient._id,{$push: {prescription:pharcyorderid,payment:paymentids}});
        var queryresult = yield (0, patientmanagement_1.updatepatient)(patient._id, { $push: { prescription: pharcyorderid } });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.pharmacyorder = pharmacyorder;
//get all pharmacy orderf
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
const confirmpharmacyorder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //extract option
        const { option, remark, qty } = req.body;
        if (option == true) {
            (0, otherservices_1.validateinputfaulsyvalue)({ qty });
        }
        const { id } = req.params;
        //search for the lab request
        var prescriptionresponse = yield (0, prescription_1.readoneprescription)({ _id: id }, {}, 'patient', '', '');
        const { prescription, orderid, patient, pharmacy } = prescriptionresponse;
        //get amount 
        var orderPrice = yield (0, price_1.readoneprice)({ servicetype: prescription, servicecategory: config_1.default.category[1], pharmacy });
        if (!orderPrice) {
            throw new Error(`${config_1.default.error.errornopriceset} ${prescription}`);
        }
        if (orderPrice.qty <= 0) {
            throw new Error(`${prescription} ${config_1.default.error.erroravailability}`);
        }
        //validate quantity entered
        var amount = patient.isHMOCover == config_1.default.ishmo[1] ? Number(orderPrice.amount) * config_1.default.hmodrugpayment * qty : Number(orderPrice.amount) * qty;
        let paymentreference;
        //validate the status
        //search for patient under admission. if the patient is admitted the patient admission number will be use as payment reference
        var findAdmission = yield (0, admissions_1.readoneadmission)({ patient: patient._id, status: { $ne: config_1.default.admissionstatus[5] } }, {}, '');
        if (findAdmission) {
            paymentreference = findAdmission.admissionid;
        }
        else {
            paymentreference = orderid;
        }
        let queryresult;
        if (option == true) {
            var createpaymentqueryresult = yield (0, payment_1.createpayment)({ paymentreference, paymentype: prescription, paymentcategory: config_1.default.category[1], patient: patient._id, amount, qty });
            queryresult = yield (0, prescription_1.updateprescription)(id, { dispensestatus: config_1.default.status[10], payment: createpaymentqueryresult._id, remark, qty });
            yield (0, patientmanagement_1.updatepatient)(patient._id, { $push: { payment: createpaymentqueryresult._id } });
        }
        else {
            queryresult = yield (0, prescription_1.updateprescription)(id, { dispensestatus: config_1.default.status[13], remark });
        }
        res.status(200).json({ queryresult, status: true });
        //if accept
        //accept or reject lab order
        //var createpaymentqueryresult =await createpayment({paymentreference:id,paymentype:testname[i],paymentcategory:testsetting[0].category,patient:appointment.patient,amount:Number(testPrice.amount)})
        //paymentids.push(createpaymentqueryresult._id);
        //var queryresult=await updatepatient(appointment.patient,{$push: {payment:paymentids}});
        //var testrecord = await createlab({payment:createpaymentqueryresult._id});
        //change status to 2 or  13 for reject
    }
    catch (e) {
        console.log("error", e);
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.confirmpharmacyorder = confirmpharmacyorder;
//get all pharmacy order
const dispense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //dispense
        //search product in inventory
        var response = yield (0, prescription_1.readoneprescription)({ _id: id }, {}, 'patient', '', '');
        const { dispensestatus, patient } = response;
        //check product status
        if (dispensestatus !== config_1.default.status[10]) {
            throw new Error(`Dispense ${config_1.default.error.errortasknotpending}`);
        }
        //check payment status
        var findAdmission = yield (0, admissions_1.readoneadmission)({ patient: patient._id, status: { $ne: config_1.default.admissionstatus[5] } }, {}, '');
        console.log('findAdmission', findAdmission);
        if (!findAdmission) {
            var paymentrecord = yield (0, payment_1.readonepayment)({ _id: response.payment });
            if (paymentrecord.status !== config_1.default.status[3]) {
                throw new Error(config_1.default.error.errorpayment);
            }
        }
        // console.log(testname[i]);
        var orderPrice = yield (0, price_1.readoneprice)({ servicetype: response.prescription, servicecategory: config_1.default.category[1] });
        console.log('orderprice', orderPrice);
        if (!orderPrice) {
            throw new Error(config_1.default.error.errornopriceset);
        }
        if (!orderPrice.qty || orderPrice.qty <= 0) {
            throw new Error(`${response.prescription} ${config_1.default.error.erroravailability} or qty not defined in inventory`);
        }
        //reduce the quantity
        yield (0, price_1.updateprice)({ _id: orderPrice._id }, { qty: Number(orderPrice.qty) - Number(response.qty) });
        //change status 6
        var queryresult = yield (0, prescription_1.updateprescription)(response._id, { dispensestatus: config_1.default.status[6] });
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.dispense = dispense;
// get price of drug
const getpriceofdrug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //search for the lab request
        var prescriptionresponse = yield (0, prescription_1.readoneprescription)({ _id: id }, {}, 'patient', '', '');
        const { prescription, patient, pharmacy } = prescriptionresponse;
        //get amount 
        var orderPrice = yield (0, price_1.readoneprice)({ servicetype: prescription, servicecategory: config_1.default.category[1], pharmacy });
        var amount = patient.isHMOCover == config_1.default.ishmo[1] ? Number(orderPrice.amount) * config_1.default.hmodrugpayment : Number(orderPrice.amount);
        res.status(200).json({ price: amount, status: true });
    }
    catch (e) {
        console.log("error", e);
        res.status(403).json({ status: false, msg: e.message });
    }
});
exports.getpriceofdrug = getpriceofdrug;
