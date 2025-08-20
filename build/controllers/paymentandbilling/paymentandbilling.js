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
exports.CreateBilingRecord = exports.getCashierTotal = exports.payAnnualSubscription = void 0;
exports.confirmgrouppayment = confirmgrouppayment;
exports.readpaymentbyreferencenumber = readpaymentbyreferencenumber;
exports.groupreadallpayment = groupreadallpayment;
exports.groupreadallpaymentoptimized = groupreadallpaymentoptimized;
exports.readbillinghistoryforapatient = readbillinghistoryforapatient;
exports.readbillinghistoryforallapatient = readbillinghistoryforallapatient;
exports.confirmpayment = confirmpayment;
exports.printreceipt = printreceipt;
const payment_1 = require("../../dao/payment");
const patientmanagement_1 = require("../../dao/patientmanagement");
const lab_1 = require("../../dao/lab");
const config_1 = __importDefault(require("../../config"));
const otherservices_1 = require("../../utils/otherservices");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const errors_1 = require("../../errors");
const price_1 = require("../../dao/price");
const uuid_1 = require("uuid");
const generatePaymentNumber = () => {
    const uniqueId = (0, uuid_1.v4)();
    return `Billing-${new Date().getFullYear()}-${uniqueId}`;
};
exports.payAnnualSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId } = req.body;
    // Check patient exists
    const patient = yield (0, patientmanagement_1.readonepatient)({ _id: patientId }, {}, '', '');
    if (!patient) {
        throw new Error("Patient not found");
    }
    const subscriptionPrice = yield (0, price_1.readoneprice)({ servicecategory: config_1.default.category[8], servicetype: config_1.default.category[8] });
    if (!subscriptionPrice) {
        throw new Error(config_1.default.error.errornopriceset);
    }
    const { amount } = subscriptionPrice;
    var payment = yield (0, payment_1.createpayment)({ firstName: patient === null || patient === void 0 ? void 0 : patient.firstName, lastName: patient === null || patient === void 0 ? void 0 : patient.lastName, MRN: patient === null || patient === void 0 ? void 0 : patient.MRN, phoneNumber: patient === null || patient === void 0 ? void 0 : patient.phoneNumber, paymentreference: patient._id, paymentype: config_1.default.category[8], paymentcategory: config_1.default.category[8], patient: patient._id, amount });
    // Extend subscription by 1 year
    res.status(201).json({ queryresult: "Subscription payment recorded", payment, status: true });
}));
///deactivate a user
//show total for each login cashier
exports.getCashierTotal = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email } = (req.user).user;
    // Get start and end of today (local time)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const total = yield (0, payment_1.readallpaymentaggregate)([
        { $match: { status: config_1.default.status[3], cashieremail: email, updatedAt: { $gte: startOfDay, $lte: endOfDay } } }, // Filter only completed payments if needed
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        }
    ]);
    res.json({ queryresult: ((_a = total[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0, status: true });
}));
//cashieremail:email,cashierid:staffId
//confirm payment
function confirmgrouppayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log(req.user);
        try {
            const { paymentreferenceid } = req.params;
            //check for null of id
            const response = yield (0, payment_1.readallpayment)({ paymentreference: paymentreferenceid, status: config_1.default.status[2] }, '');
            const { paymentdetails } = response;
            if (!paymentdetails || paymentdetails.length === 0)
                throw new Error("no paymentfound for this service");
            for (var i = 0; i < paymentdetails.length; i++) {
                let { paymentype, paymentcategory, paymentreference, patient, _id } = paymentdetails[i];
                //const {patient} = paymentdetails[i];
                const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: patient, status: config_1.default.status[1] }, {}, '', '');
                let cardFeePaid;
                let subscriptionfeePaid;
                console.log('*********', paymentcategory);
                console.log('*********', config_1.default.category[3]);
                console.log('*********', config_1.default.category[8]);
                console.log('*********', config_1.default.category[9]);
                if (!patientrecord && !(paymentcategory == config_1.default.category[3] || paymentcategory == config_1.default.category[8] || paymentcategory == config_1.default.category[9])) {
                    throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit} or has not made payment for registration`);
                }
                if (paymentcategory == config_1.default.category[3]) {
                    cardFeePaid = yield (0, payment_1.readonepayment)({
                        patient,
                        paymentype: config_1.default.category[9],
                        paymentreference,
                        paymentcategory: config_1.default.category[9],
                        status: config_1.default.status[2]
                    });
                    //read payment for subscription fee
                    subscriptionfeePaid = yield (0, payment_1.readonepayment)({
                        patient,
                        paymentype: config_1.default.category[8],
                        paymentreference,
                        paymentcategory: config_1.default.category[8],
                        status: config_1.default.status[2]
                    });
                }
                //ensure card fee and annual fee is paid before confirming payment for patient registration
                if (paymentcategory == config_1.default.category[3] && (cardFeePaid || subscriptionfeePaid)) {
                    throw new Error(`Patient has not paid for ${config_1.default.category[9]} or ${config_1.default.category[8]}`);
                }
                //var settings =await  configuration.settings();
                const status = config_1.default.status[3];
                const { email, staffId, firstName, lastName } = (req.user).user;
                var cashiername = `${firstName} ${lastName}`;
                const queryresult = yield (0, payment_1.updatepayment)(_id, { status, cashieremail: email, cashiername, cashierid: staffId });
                //const {paymentype,paymentcategory,paymentreference} = queryresult;
                //for patient registration
                if (paymentcategory == config_1.default.category[3]) {
                    //update patient registration status
                    yield (0, patientmanagement_1.updatepatientbyanyquery)({ _id: patient }, { status: config_1.default.status[1], paymentstatus: status, paymentreference });
                }
                //for lab test
                else if (paymentcategory == config_1.default.category[2]) {
                    //update lab test
                    yield (0, lab_1.updatelabbyquery)({ payment: _id }, { status: config_1.default.status[5] });
                }
                else if (paymentcategory == config_1.default.category[8]) {
                    const nextYear = new Date();
                    nextYear.setFullYear(nextYear.getFullYear() + 1);
                    yield (0, payment_1.updatepayment)(_id, { subscriptionPaidUntil: nextYear });
                }
            }
            res.status(200).json({
                queryresult: paymentreferenceid,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
function readpaymentbyreferencenumber(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        try {
            const { paymentreference } = req.params;
            //validate ticket id
            (0, otherservices_1.validateinputfaulsyvalue)({
                paymentreference,
            });
            var populatequery = 'patient';
            // Aggregation to calculate sum and add it as a new field
            var query = { paymentreference };
            let totalAmount = yield (0, payment_1.readallpaymentaggregate)([
                {
                    $match: query
                },
                {
                    $group: {
                        _id: null, // null means no grouping, we just want the total sum for the entire collection
                        totalAmount: { $sum: "$amount" } // Sum of the itemPrice for all documents
                    }
                },
                {
                    $project: {
                        totalAmount: 1,
                        _id: 0
                    }
                }
            ]);
            const queryresult = yield (0, payment_1.readallpayment)({ paymentreference }, populatequery);
            res.json({
                queryresult,
                totalAmount,
                status: true,
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//recall
function groupreadallpayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //const { paymentreference } = req.params;
            var { status } = req.params;
            var filter = {};
            if (status == "paid") {
                filter.status = config_1.default.status[3];
            }
            else {
                filter.status = config_1.default.status[2];
            }
            const referencegroup = [
                //look up patient
                //add query
                {
                    $match: filter
                },
                {
                    $lookup: {
                        from: "patientsmanagements",
                        localField: "patient",
                        foreignField: "_id",
                        as: "patient",
                    },
                },
                {
                    $group: {
                        _id: "$paymentreference",
                        paymentreference: { $first: "$paymentreference" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                        amount: { $sum: "$amount" },
                        patient: { $first: "$patient" }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        paymentreference: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        amount: 1,
                        patient: 1
                    }
                },
                { $sort: { createdAt: -1 } },
            ];
            const queryresult = yield (0, payment_1.readpaymentaggregate)(referencegroup);
            res.json({
                queryresult,
                status: true,
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
function groupreadallpaymentoptimized(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //const { paymentreference } = req.params;
            var { status, firstName, MRN, HMOId, lastName, phoneNumber, email, paymentreference } = req.query;
            //var filter:any = {};
            var statusfilter = {};
            console.log('/////query//', req.query);
            var page = parseInt(req.query.page) || 1;
            var size = parseInt(req.query.size) || 150;
            if (status == "paid") {
                statusfilter.status = config_1.default.status[3];
            }
            else {
                statusfilter.status = config_1.default.status[2];
            }
            if (paymentreference)
                statusfilter.paymentreference = paymentreference;
            if (firstName)
                statusfilter.firstName = new RegExp(`^${firstName}`, 'i');
            if (lastName)
                statusfilter.lastName = new RegExp(`^${lastName}`, 'i');
            if (MRN)
                statusfilter.MRN = new RegExp(`^${MRN}`, 'i');
            if (phoneNumber)
                statusfilter.phoneNumber = new RegExp(`^${phoneNumber}`, 'i');
            //paymentreference
            ////////////////////////////////////
            const pipeline = [];
            // Add status filter
            pipeline.push({ $match: statusfilter });
            pipeline.push({
                $group: {
                    _id: "$paymentreference",
                    paymentreference: { $first: "$paymentreference" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    amount: { $sum: "$amount" },
                    firstName: { $first: "$firstName" },
                    phoneNumber: { $first: "$phoneNumber" },
                    lastName: { $first: "$lastName" },
                    MRN: { $first: "$MRN" }
                },
            });
            pipeline.push({
                $project: {
                    _id: 0,
                    paymentreference: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    amount: 1,
                    firstName: 1,
                    phoneNumber: 1,
                    lastName: 1,
                    MRN: 1,
                },
            });
            // Sorting
            pipeline.push({ $sort: { createdAt: -1 } });
            const queryresult = yield (0, payment_1.readpaymentaggregateoptimized)(pipeline, page, size);
            console.log('*******', queryresult);
            res.json({
                queryresult,
                status: true,
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//read particular patient payment history
function readbillinghistoryforapatient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            var query = { patient: id };
            var populatequery = 'patient';
            const queryresult = yield (0, payment_1.readallpayment)(query, populatequery);
            res.json({
                queryresult,
                status: true,
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//get billing history for all patient
function readbillinghistoryforallapatient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var query = {};
            var populatequery = 'patient';
            const queryresult = yield (0, payment_1.readallpayment)(query, populatequery);
            res.json({
                queryresult,
                status: true,
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//confirm payment
function confirmpayment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log(req.user);
        try {
            const { id } = req.params;
            //check for null of id
            const response = yield (0, payment_1.readonepayment)({ _id: id });
            if (!response)
                throw new Error("no payment found for this service");
            const { patient, paymentcategory, paymentreference } = response;
            const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: patient, status: config_1.default.status[1] }, {}, '', '');
            let cardFeePaid;
            let subscriptionfeePaid;
            if (!patientrecord && paymentcategory !== config_1.default.category[3]) {
                throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit} or has not made payment for registration`);
            }
            if (paymentcategory == config_1.default.category[3]) {
                cardFeePaid = yield (0, payment_1.readonepayment)({
                    patient,
                    paymentype: config_1.default.category[9],
                    paymentreference,
                    paymentcategory: config_1.default.category[9],
                    status: config_1.default.status[2]
                });
                //read payment for subscription fee
                subscriptionfeePaid = yield (0, payment_1.readonepayment)({
                    patient,
                    paymentype: config_1.default.category[8],
                    paymentreference,
                    paymentcategory: config_1.default.category[8],
                    status: config_1.default.status[2]
                });
            }
            if (paymentcategory == config_1.default.category[3] && (cardFeePaid || subscriptionfeePaid)) {
                throw new Error(`Patient has not paid for ${config_1.default.category[9]} or ${config_1.default.category[8]}`);
            }
            //var settings =await  configuration.settings();
            const status = config_1.default.status[3];
            const { email, staffId } = (req.user).user;
            const queryresult = yield (0, payment_1.updatepayment)(id, { status, cashieremail: email, cashierid: staffId });
            //const queryresult:any =await updatepayment(id,{status});
            //confirm payment of the service paid for 
            //for patient registration
            if (paymentcategory == config_1.default.category[3]) {
                //update patient registration status
                yield (0, patientmanagement_1.updatepatientbyanyquery)({ _id: patient }, { status: config_1.default.status[1] });
            }
            /*
            
            //for appointment
            else if(paymentcategory == configuration.category[0]){
              //schedule the patient
              //payment
              await updateappointmentbyquery({payment:id},{status:configuration.status[5]});
        
            }
              */
            //for lab test
            else if (paymentcategory == config_1.default.category[2]) {
                //update lab test
                yield (0, lab_1.updatelabbyquery)({ payment: id }, { status: config_1.default.status[5] });
            }
            else if (paymentcategory == config_1.default.category[8]) {
                const nextYear = new Date();
                nextYear.setFullYear(nextYear.getFullYear() + 1);
                patientrecord.subscriptionPaidUntil = nextYear;
                yield patientrecord.save();
            }
            //update for pharmacy
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//print receipt
function printreceipt(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { paymentreference } = req.params;
            const { firstName, lastName } = (req.user).user;
            var staffname = `${firstName} ${lastName}`;
            //paymentreference
            var query = { paymentreference, status: config_1.default.status[3] };
            var populatequery = 'patient';
            let queryresult = yield (0, payment_1.readallpayment)({ paymentreference, status: config_1.default.status[3] }, populatequery);
            //get total sum
            // Aggregation to calculate sum and add it as a new field
            let totalAmount = yield (0, payment_1.readallpaymentaggregate)([
                {
                    $match: query
                },
                {
                    $group: {
                        _id: null, // null means no grouping, we just want the total sum for the entire collection
                        totalAmount: { $sum: "$amount" } // Sum of the itemPrice for all documents
                    }
                },
                {
                    $project: {
                        totalAmount: 1,
                        _id: 0
                    }
                }
            ]);
            //update numberoftimesprinted
            yield (0, payment_1.updatepaymentbyquery)(query, { $inc: { numberoftimesprinted: 1 } });
            res.json({
                queryresult,
                totalAmount,
                timestamp: new Date().toLocaleString("en-NG", {
                    timeZone: "Africa/Lagos"
                }),
                printedbystaffname: staffname,
                status: true,
            });
        }
        catch (e) {
            console.log(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
exports.CreateBilingRecord = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId } = req.params;
    const { serviceCategory, amount, serviceType, phoneNumber } = req.body;
    const { _id: userId } = (req.user).user;
    const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: patientId }, {}, '', '');
    if (!foundPatient) {
        return next(new errors_1.ApiError(404, `Patient do not ${config_1.default.error.erroralreadyexit}`));
    }
    const { firstName, lastName, } = foundPatient;
    const refNumber = generatePaymentNumber();
    const paymentInfo = yield (0, payment_1.createpayment)({
        firstName,
        lastName,
        MRN: req.body.MRN,
        phoneNumber,
        paymentreference: refNumber,
        paymentype: serviceType,
        paymentcategory: serviceCategory,
        patient: foundPatient._id,
        amount: Number(amount),
        createdById: userId,
    });
    res.status(201).json({
        status: true,
        message: "custom billing info created for user!",
        data: paymentInfo
    });
}));
