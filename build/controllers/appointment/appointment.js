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
exports.countPatientsPerDoctor = exports.getDoctorsByClinic = exports.assignDoctorToAppointment = exports.readallvitalchartByAppointment = exports.getAllVtalsByPatient = exports.laborder = exports.examinepatient = exports.getAllPaidQueueSchedules = exports.getAllPaidSchedulesByPatient = exports.getAllPaidSchedulesoptimized = exports.getAllPaidSchedules = exports.getAllInProgressClinicalEncounter = exports.getAllInProgressEncounter = exports.getAllCompletedEncounter = exports.getAllCompletedClinicalEncounter = exports.getAllPreviousClininicalEncounter = exports.getAllPreviousEncounter = exports.getAllSchedulesByPatient = exports.getAllSchedules = exports.getAllSchedulesoptimized = exports.scheduleappointment = void 0;
exports.updateappointments = updateappointments;
exports.addclinicalencounter = addclinicalencounter;
exports.addencounter = addencounter;
const appointment_1 = require("../../dao/appointment");
const admissions_1 = require("../../dao/admissions");
const vitalcharts_1 = require("../../dao/vitalcharts");
const vitalcharts_2 = require("../../dao/vitalcharts");
const patientmanagement_1 = require("../../dao/patientmanagement");
const hmocategorycover_1 = require("../../dao/hmocategorycover");
const users_1 = require("../../dao/users");
const price_1 = require("../../dao/price");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const payment_1 = require("../../dao/payment");
const mongoose_1 = __importDefault(require("mongoose"));
//import {createvital} from "../../dao/vitals";
const lab_1 = require("../../dao/lab");
const otherservices_1 = require("../../utils/otherservices");
const config_1 = __importDefault(require("../../config"));
const { ObjectId } = mongoose_1.default.Types;
//add vitals for 
// Create a new schedule
const scheduleappointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        //req.body.appointmentdate=new Date(req.body.appointmentdate);
        var appointmentid = String(Date.now());
        //const {id} = req.params;
        var { clinic, reason, appointmentdate, appointmentcategory, appointmenttype, patient, policecase, physicalassault, sexualassault, policaename, servicenumber, policephonenumber, division } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ clinic, appointmentdate, appointmentcategory, appointmenttype, patient });
        //pending
        //validatioborder
        var selectquery = {
            "title": 1, "firstName": 1, "middleName": 1, "lastName": 1, "country": 1, "stateOfResidence": 1, "LGA": 1, "address": 1, "age": 1, "dateOfBirth": 1, "gender": 1, "nin": 1, "phoneNumber": 1, "email": 1, "oldMRN": 1, "nextOfKinName": 1, "nextOfKinRelationship": 1, "nextOfKinPhoneNumber": 1, "nextOfKinAddress": 1,
            "maritalStatus": 1, "disability": 1, "occupation": 1, "isHMOCover": 1, "HMOName": 1, "HMOId": 1, "HMOPlan": 1, "MRN": 1, "createdAt": 1, "passport": 1
        };
        //search patient if available and por
        const patientrecord = yield (0, patientmanagement_1.readonepatient)({ _id: patient, status: config_1.default.status[1] }, selectquery, 'insurance', '');
        // const patientrecord =  await readonepatient({_id:patient},selectquery,'','');
        if (!patientrecord) {
            throw new Error(`Patient donot ${config_1.default.error.erroralreadyexit}`);
        }
        var { firstName, lastName, MRN, HMOId, HMOName } = patientrecord;
        //search for price if available
        var appointmentPrice = yield (0, price_1.readoneprice)({ servicecategory: appointmentcategory, servicetype: appointmenttype });
        if (!appointmentPrice) {
            throw new Error(config_1.default.error.errornopriceset);
        }
        let insurance = yield (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: (_a = patientrecord === null || patientrecord === void 0 ? void 0 : patientrecord.insurance) === null || _a === void 0 ? void 0 : _a._id, category: config_1.default.category[0] }, { hmopercentagecover: 1 });
        var hmopercentagecover = (_b = insurance === null || insurance === void 0 ? void 0 : insurance.hmopercentagecover) !== null && _b !== void 0 ? _b : 0;
        var amount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(hmopercentagecover), Number(appointmentPrice.amount));
        //create appointment
        //create payment
        let createpaymentqueryresult;
        let queryresult;
        if (amount == 0) {
            let vitals = yield (0, vitalcharts_1.createvitalcharts)({ status: config_1.default.status[8], patient: patientrecord._id });
            queryresult = yield (0, appointment_1.createappointment)({ amount, policecase, physicalassault, sexualassault, policaename, servicenumber, policephonenumber, division, appointmentid, patient: patientrecord._id, clinic, reason, appointmentdate, appointmentcategory, appointmenttype, vitals: vitals._id, firstName, lastName, MRN, HMOId, HMOName });
            yield (0, patientmanagement_1.updatepatient)(patient, { $push: { appointment: queryresult._id } });
        }
        else if (amount > 0) {
            createpaymentqueryresult = yield (0, payment_1.createpayment)({ firstName: patientrecord === null || patientrecord === void 0 ? void 0 : patientrecord.firstName, lastName: patientrecord === null || patientrecord === void 0 ? void 0 : patientrecord.lastName, MRN: patientrecord === null || patientrecord === void 0 ? void 0 : patientrecord.MRN, phoneNumber: patientrecord === null || patientrecord === void 0 ? void 0 : patientrecord.phoneNumber, paymentreference: appointmentid, paymentype: appointmenttype, paymentcategory: appointmentcategory, patient, amount });
            let vitals = yield (0, vitalcharts_1.createvitalcharts)({ status: config_1.default.status[8], patient: patientrecord._id });
            queryresult = yield (0, appointment_1.createappointment)({ amount, policecase, physicalassault, sexualassault, policaename, servicenumber, policephonenumber, division, appointmentid, payment: createpaymentqueryresult._id, patient: patientrecord._id, clinic, reason, appointmentdate, appointmentcategory, appointmenttype, vitals: vitals._id, firstName, lastName, MRN, HMOId, HMOName });
            //create vitals
            yield (0, patientmanagement_1.updatepatient)(patient, { $push: { payment: createpaymentqueryresult._id, appointment: queryresult._id } });
        }
        //create vitals
        //update patient
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.scheduleappointment = scheduleappointment;
// Get all schedueled records
const getAllSchedulesoptimized = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { firstName, MRN, lastName, appointmenttype } = req.query;
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 150;
        let filter = {};
        //var otherfilter:any = {};
        //appointment, type, MRN,patient name, 
        // Add filters based on query parameters
        if (firstName) {
            //console.log(req.query.firstName)
            filter.firstName = new RegExp(firstName, 'i'); // Case-insensitive search for name
        }
        if (MRN) {
            filter.MRN = new RegExp(MRN, 'i');
        }
        if (lastName) {
            filter.lastName = new RegExp(lastName, 'i'); // Case-insensitive search for email
        }
        if (appointmenttype) {
            filter.appointmenttype = new RegExp(appointmenttype, 'i'); // Case-insensitive search for email
        }
        const referencegroup = [
            //look up patient
            //add query
            {
                $match: filter
            },
            {
                $project: {
                    _id: 1,
                    doctorassigment: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    appointmenttype: 1,
                    appointmentdate: 1,
                    clinic: 1,
                    appointmentcategory: 1,
                    firstName: 1,
                    lastName: 1,
                    MRN: 1,
                    HMOId: 1,
                    HMOName: 1,
                    status: 1,
                    paymentstatus: 1,
                    paymentreference: 1,
                    doctorsfirstName: 1,
                    doctorslastName: 1
                    //phoneNumber
                    //isHMOCover
                }
            },
            { $sort: { createdAt: -1 } },
        ];
        const queryresult = yield (0, appointment_1.readallappointmentpaginated)(referencegroup, page, size);
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllSchedulesoptimized = getAllSchedulesoptimized;
// Get all schedueled records
const getAllSchedules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryresult = yield (0, appointment_1.readallappointment)({}, {}, 'patient', 'doctor', 'payment', '', '', '', '', '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllSchedules = getAllSchedules;
//update appiontment
function updateappointments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get id
            const { id, status } = req.params;
            //reject if status
            /*
            if(status){
          
            }
            */
            var queryresult = yield (0, appointment_1.updateappointment)(id, req.body);
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
//get schedule by patient
const getAllSchedulesByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const queryresult = yield (0, appointment_1.readallappointment)({ patient: id }, {}, 'patient', 'doctor', 'payment', '', '', '', '', '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllSchedulesByPatient = getAllSchedulesByPatient;
//previous encounter
const getAllPreviousEncounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //const {clinic} = (req.user).user;
        //console.log(clinic);
        const queryresult = yield (0, appointment_1.readallappointment)({ $or: [{ status: config_1.default.status[6] }, { status: config_1.default.status[9] }], patient: id, fromclinicalencounter: false }, {}, 'patient', 'doctor', 'payment', 'lab', 'radiology', 'procedure', 'prescription', 'admission', 'vitals');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllPreviousEncounter = getAllPreviousEncounter;
const getAllPreviousClininicalEncounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //const {clinic} = (req.user).user;
        //console.log(clinic);
        const queryresult = yield (0, appointment_1.readallappointment)({ $or: [{ status: config_1.default.status[6] }, { status: config_1.default.status[9] }], patient: id, fromclinicalencounter: true }, {}, 'patient', 'doctor', 'payment', 'lab', 'radiology', 'procedure', 'prescription', 'admission', 'vitals');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllPreviousClininicalEncounter = getAllPreviousClininicalEncounter;
//get all completed clinical encounter
const getAllCompletedClinicalEncounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //const {clinic} = (req.user).user;
        const queryresult = yield (0, appointment_1.readallappointment)({ status: config_1.default.status[6], patient: id, fromclinicalencounter: true }, {}, 'patient', 'doctor', 'payment', '', '', '', '', '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllCompletedClinicalEncounter = getAllCompletedClinicalEncounter;
//completed encounter
const getAllCompletedEncounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //const {clinic} = (req.user).user;
        const queryresult = yield (0, appointment_1.readallappointment)({ status: config_1.default.status[6], patient: id, fromclinicalencounter: false }, {}, 'patient', 'doctor', 'payment', '', '', '', '', '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllCompletedEncounter = getAllCompletedEncounter;
//inprogress encounter
const getAllInProgressEncounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const {clinic} = (req.user).user;
        const { id } = req.params;
        const queryresult = yield (0, appointment_1.readallappointment)({ status: config_1.default.status[9], patient: id, fromclinicalencounter: false }, {}, 'patient', 'doctor', 'payment', '', '', '', '', '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllInProgressEncounter = getAllInProgressEncounter;
const getAllInProgressClinicalEncounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const {clinic} = (req.user).user;
        const { id } = req.params;
        const queryresult = yield (0, appointment_1.readallappointment)({ status: config_1.default.status[9], patient: id, fromclinicalencounter: true }, {}, 'patient', 'doctor', 'payment', '', '', '', '', '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllInProgressClinicalEncounter = getAllInProgressClinicalEncounter;
//get all patient with paid schduled
const getAllPaidSchedules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const {clinic} = (req.user).user;
        const { clinic } = req.params;
        // const queryresult = await readallappointment({$or:[{status:configuration.status[5]},{status:configuration.status[6]},{status:configuration.status[9]}],clinic},{},'patient','doctor','payment');
        let aggregatequery = [
            {
                $match: { clinic } // Filter payment
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'payment',
                    foreignField: '_id',
                    as: 'payment'
                }
            },
            {
                $lookup: {
                    from: 'patientsmanagements',
                    localField: 'patient',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctor',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $lookup: {
                    from: 'vitalcharts',
                    localField: 'vitals',
                    foreignField: '_id',
                    as: 'vitals'
                }
            },
            //vitals
            {
                $unwind: {
                    path: '$payment', // Deconstruct the payment array (from the lookup)
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$patient',
                    preserveNullAndEmptyArrays: true
                } // Deconstruct the patient array (from the lookup)
            },
            {
                $unwind: {
                    path: '$vitals',
                    preserveNullAndEmptyArrays: true
                } // Deconstruct the patient array (from the lookup)
            },
            {
                $match: { $or: [{ 'payment.status': config_1.default.status[3] }, { amount: 0 }] } // Filter payment
            }
        ];
        const queryresult = yield (0, appointment_1.modifiedreadallappointment)({ clinic }, aggregatequery);
        console.log('allresult', queryresult);
        //const queryresult = await readallappointment({clinic},{},'patient','doctor',{path:'payment', match: { status: { $eq: configuration.status[3] } },});
        //'payment.status':configuration.status[3]
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllPaidSchedules = getAllPaidSchedules;
const getAllPaidSchedulesoptimized = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = (req.user).user;
        //doctor
        //for nursings 
        // Get today's date
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set the time to 00:00:00
        // Get the start of tomorrow to set the range for "today"
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);
        //const {clinic} = (req.user).user;
        const { clinic } = req.params;
        var { status, firstName, MRN, HMOId, lastName, phoneNumber } = req.query;
        var page = parseInt(req.query.page) || 1;
        var size = parseInt(req.query.size) || 150;
        // var statusfilter:any =status?{status,clinic}:{clinic};
        // const queryresult = await readallappointment({$or:[{status:configuration.status[5]},{status:configuration.status[6]},{status:configuration.status[9]}],clinic},{},'patient','doctor','payment');
        let aggregatequery = (req.query.status == "today_queue") ? [
            {
                $match: { doctor: new ObjectId(_id), status: config_1.default.status[5], clinic, appointmentdate: { $gte: startOfDay, $lt: endOfDay } } // Filter payment
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'payment',
                    foreignField: '_id',
                    as: 'payment'
                }
            },
            {
                $lookup: {
                    from: 'patientsmanagements',
                    localField: 'patient',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctor',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $lookup: {
                    from: 'vitalcharts',
                    localField: 'vitals',
                    foreignField: '_id',
                    as: 'vitals'
                }
            },
            {
                $unwind: {
                    path: '$payment',
                    preserveNullAndEmptyArrays: true
                } // Deconstruct the payment array (from the lookup)
            },
            {
                $unwind: {
                    path: '$vitals',
                    preserveNullAndEmptyArrays: true
                } // Deconstruct the payment array (from the lookup)
            },
            {
                $unwind: {
                    path: '$patient',
                    preserveNullAndEmptyArrays: true
                } // Deconstruct the patient array (from the lookup)
            },
            {
                $match: { $or: [{ 'payment.status': config_1.default.status[3] }, { amount: 0 }] } // Filter payment
            },
            {
                $project: {
                    _id: 1,
                    doctorassigment: 1,
                    createdAt: 1,
                    appointmentid: 1,
                    admission: 1,
                    doctor: 1,
                    reason: 1,
                    updatedAt: 1,
                    appointmenttype: 1,
                    appointmentdate: 1,
                    clinic: 1,
                    patient: 1,
                    firstName: "$patient.firstName",
                    lastName: "$patient.lastName",
                    MRN: "$patient.MRN",
                    HMOId: "$patient.HMOId",
                    HMOName: "$patient.HMOName",
                    appointmentcategory: 1,
                    vitalstatus: "$vitals.status",
                    vitals: 1,
                    clinicalencounter: 1,
                    status: 1,
                    payment: "$payment",
                    policecase: 1,
                    physicalassault: 1,
                    sexualassault: 1,
                    policaename: 1,
                    servicenumber: 1,
                    policephonenumber: 1,
                }
            },
            { $sort: { createdAt: 1 } },
        ] :
            [
                { $match: Object.assign({ clinic }, (status && { status })) },
                {
                    $lookup: {
                        from: 'patientsmanagements',
                        localField: 'patient',
                        foreignField: '_id',
                        as: 'patient'
                    }
                },
                { $unwind: '$patient' },
                {
                    $match: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (firstName ? { 'patient.firstName': new RegExp(firstName, 'i') } : {})), (MRN ? { 'patient.MRN': new RegExp(MRN, 'i') } : {})), (HMOId ? { 'patient.HMOId': new RegExp(HMOId, 'i') } : {})), (lastName ? { 'patient.lastName': new RegExp(lastName, 'i') } : {})), (phoneNumber ? { 'patient.phoneNumber': new RegExp(phoneNumber, 'i') } : {}))
                },
                // Repeat lookup structure for payments, doctor, vitals (but skip if not needed)
                {
                    $lookup: {
                        from: 'payments',
                        localField: 'payment',
                        foreignField: '_id',
                        as: 'payment'
                    }
                },
                { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
                {
                    $match: {
                        $or: [
                            { 'payment.status': config_1.default.status[3] },
                            { amount: 0 }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'vitalcharts',
                        localField: 'vitals',
                        foreignField: '_id',
                        as: 'vitals'
                    }
                },
                {
                    $unwind: {
                        path: '$vitals',
                        preserveNullAndEmptyArrays: true
                    } // Deconstruct the patient array (from the lookup)
                },
                {
                    $project: {
                        _id: 1,
                        doctorassigment: 1,
                        createdAt: 1,
                        reason: 1,
                        updatedAt: 1,
                        appointmenttype: 1,
                        appointmentdate: 1,
                        clinic: 1,
                        appointmentcategory: 1,
                        //patient:{ $arrayElemAt: ["$patient", 0] },
                        patient: 1,
                        vitals: 1,
                        vitalstatus: "$vitals.status",
                        status: 1,
                        //doctorsfirstName:"$doctor.firstName",
                        //doctorslastName:"$doctor.lastName"
                    }
                },
                { $sort: { createdAt: -1 } },
            ];
        const queryresult = yield (0, appointment_1.optimizedreadallappointment)(aggregatequery, page, size);
        //const queryresult = await readallappointment({clinic},{},'patient','doctor',{path:'payment', match: { status: { $eq: configuration.status[3] } },});
        //'payment.status':configuration.status[3]
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllPaidSchedulesoptimized = getAllPaidSchedulesoptimized;
//get schedule by single patient
const getAllPaidSchedulesByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const {clinic} = (req.user).user;
        const { id } = req.params;
        const queryresult = yield (0, appointment_1.readallappointment)({ patient: id, $or: [{ status: config_1.default.status[5] }, { status: config_1.default.status[6] }] }, {}, 'patient', 'doctor', 'payment', '', '', '', '', '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllPaidSchedulesByPatient = getAllPaidSchedulesByPatient;
//queue
//get all patient with paid schduled
const getAllPaidQueueSchedules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //for doctors show only patient assigned to them
        const { _id } = (req.user).user;
        //doctor
        //for nursings 
        // Get today's date
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set the time to 00:00:00
        // Get the start of tomorrow to set the range for "today"
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999); // Set the time to 23:59:59  
        //const {clinic} = (req.user).user;
        const { clinic } = req.params;
        let aggregatequery = [
            {
                $match: { doctor: new ObjectId(_id), status: config_1.default.status[5], clinic, appointmentdate: { $gte: startOfDay, $lt: endOfDay } } // Filter payment
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'payment',
                    foreignField: '_id',
                    as: 'payment'
                }
            },
            {
                $lookup: {
                    from: 'patientsmanagements',
                    localField: 'patient',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctor',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $lookup: {
                    from: 'vitalcharts',
                    localField: 'vitals',
                    foreignField: '_id',
                    as: 'vitals'
                }
            },
            {
                $unwind: {
                    path: '$payment',
                    preserveNullAndEmptyArrays: true
                } // Deconstruct the payment array (from the lookup)
            },
            {
                $unwind: {
                    path: '$vitals',
                    preserveNullAndEmptyArrays: true
                } // Deconstruct the payment array (from the lookup)
            },
            {
                $unwind: {
                    path: '$patient',
                    preserveNullAndEmptyArrays: true
                } // Deconstruct the patient array (from the lookup)
            },
            {
                $match: { $or: [{ 'payment.status': config_1.default.status[3] }, { amount: 0 }] } // Filter payment
            },
            {
                $project: {
                    _id: 1,
                    doctorassigment: 1,
                    createdAt: 1,
                    appointmentid: 1,
                    admission: 1,
                    doctor: 1,
                    reason: 1,
                    updatedAt: 1,
                    appointmenttype: 1,
                    appointmentdate: 1,
                    clinic: 1,
                    patient: 1,
                    firstName: "$patient.firstName",
                    lastName: "$patient.lastName",
                    MRN: "$patient.MRN",
                    HMOId: "$patient.HMOId",
                    HMOName: "$patient.HMOName",
                    appointmentcategory: 1,
                    vitalstatus: "$vitals.status",
                    vitals: 1,
                    clinicalencounter: 1,
                    status: 1,
                    payment: "$payment",
                    policecase: 1,
                    physicalassault: 1,
                    sexualassault: 1,
                    policaename: 1,
                    servicenumber: 1,
                    policephonenumber: 1,
                }
            },
            { $sort: { createdAt: 1 } },
        ];
        const queryresult = yield (0, appointment_1.modifiedreadallappointment)({ status: config_1.default.status[5], clinic, appointmentdate: { $gte: startOfDay, $lt: endOfDay } }, aggregatequery);
        console.log('r', queryresult);
        //const queryresult = await readallappointment({status:configuration.status[5],clinic,appointmentdate: { $gte: startOfDay, $lt: endOfDay }},{},'patient','doctor','payment');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllPaidQueueSchedules = getAllPaidQueueSchedules;
//examine patient
var examinepatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { email, staffId } = (req.user).user;
        //find doctor and add doctor who examined
        const user = yield (0, users_1.readone)({ email, staffId });
        req.body.status = config_1.default.status[6];
        req.body.doctor = user === null || user === void 0 ? void 0 : user._id;
        const queryresult = yield (0, appointment_1.updateappointment)(id, req.body);
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.examinepatient = examinepatient;
//lab order
var laborder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { firstName, lastName } = (req.user).user;
        //accept _id from request.
        const { id } = req.params;
        const { testname, appointmentunderscoreid, department, note, priority } = req.body;
        const raiseby = `${firstName} ${lastName}`;
        var testid = String(Date.now());
        var testsid = [];
        //var paymentids =[];
        (0, otherservices_1.validateinputfaulsyvalue)({ id, testname, department });
        //find the record in appointment and validate
        //find patient
        const foundPatient = yield (0, patientmanagement_1.readonepatient)({ _id: id }, {}, 'insurance', '');
        // check is patient is under inssurance
        //var isHMOCover;
        // Create a new ObjectId
        var appointment;
        let patientappointment;
        var hmopercentagecover;
        //insurance
        if (foundPatient) {
            let insurance = yield (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.insurance._id, category: config_1.default.category[2] }, { hmopercentagecover: 1 });
            hmopercentagecover = (_a = insurance === null || insurance === void 0 ? void 0 : insurance.hmopercentagecover) !== null && _a !== void 0 ? _a : 0;
            patientappointment = yield (0, appointment_1.readoneappointment)({ _id: appointmentunderscoreid }, {}, 'patient');
            appointment = {
                patient: id,
                appointmentid: patientappointment ? patientappointment.appointmentid : String(Date.now()),
                _id: patientappointment ? patientappointment._id : new ObjectId()
            };
            //update appoint with lab order
            // isHMOCover = foundPatient.isHMOCover;
        }
        else {
            appointment = yield (0, appointment_1.readoneappointment)({ _id: id }, {}, 'patient');
            if (!appointment) {
                //create an appointment
                throw new Error(`Appointment donot ${config_1.default.error.erroralreadyexit}`);
            }
            //read insurance
            let insurance = yield (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: appointment.patient.insurance, category: config_1.default.category[2] }, { hmopercentagecover: 1 });
            hmopercentagecover = (_b = insurance === null || insurance === void 0 ? void 0 : insurance.hmopercentagecover) !== null && _b !== void 0 ? _b : 0;
        }
        for (var i = 0; i < testname.length; i++) {
            //    console.log(testname[i]);
            //console.log(isHMOCover);
            var testPrice = yield (0, price_1.readoneprice)({ servicetype: testname[i] });
            if ((testPrice === null || testPrice === void 0 ? void 0 : testPrice.amount) == null) {
                throw new Error(`${config_1.default.error.errornopriceset}  ${testname[i]}`);
            }
            let amount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(hmopercentagecover), Number(testPrice.amount));
            //create testrecord
            let testrecord = yield (0, lab_1.createlab)({ note, priority, testname: testname[i], patient: appointment.patient, appointment: appointment._id, appointmentid: appointment.appointmentid, testid, department, amount, raiseby });
            testsid.push(testrecord._id);
            //paymentids.push(createpaymentqueryresult._id);
        }
        //var queryresult=await updatepatient(appointment.patient,{$push: {lab:testsid,payment:paymentids}});
        var queryresult = yield (0, patientmanagement_1.updatepatient)(appointment.patient, { $push: { lab: testsid } });
        //update appoint with lab order
        if (patientappointment) {
            yield (0, appointment_1.updateappointment)(patientappointment._id, { $push: { lab: testsid } });
        }
        res.status(200).json({ queryresult, status: true });
    }
    catch (error) {
        console.log("error", error);
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.laborder = laborder;
function addclinicalencounter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { email, staffId } = (req.user).user;
            //find doctor and add doctor who examined
            const user = yield (0, users_1.readone)({ email, staffId });
            //validate id
            //validate other input paramaters
            //search appoint where appoint id = id
            //extract vitals id
            if (req.body.status == 1) {
                req.body.status = config_1.default.status[6];
            }
            else if (req.body.status == 2) {
                req.body.status = config_1.default.status[5];
            }
            else {
                req.body.status = config_1.default.status[9];
            }
            var { diagnosisnote, diagnosisicd10, assessmentnote, clinicalnote, status, plannote, outcome } = req.body;
            //validateinputfaulsyvalue({diagnosisnote,diagnosisicd10,assessmentnote,clinicalnote,outcome,plannote});
            (0, otherservices_1.validateinputfaulsyvalue)({ diagnosisnote, assessmentnote, clinicalnote, plannote });
            const clinicalencounter = { diagnosisnote, diagnosisicd10, assessmentnote, clinicalnote, plannote, outcome };
            var queryresult;
            //find id 
            var checkadimmison = yield (0, admissions_1.readoneadmission)({ _id: new ObjectId(id) }, {}, '');
            if (checkadimmison) {
                queryresult = yield (0, appointment_1.updateappointment)(id, { clinicalencounter, status, doctor: user === null || user === void 0 ? void 0 : user._id, admission: checkadimmison._id, patient: checkadimmison.patient, fromclinicalencounter: true });
            }
            else {
                queryresult = yield (0, appointment_1.updateappointmentbyquery)({ $or: [{ appointmentid: id }, { _id: id }] }, { clinicalencounter, status, fromclinicalencounter: true });
                const { firstName, lastName } = (req.user).user;
                req.body.staffname = `${firstName} ${lastName}`;
                const { height, weight, temperature, heartrate, bloodpressuresystolic, bloodpressurediastolic, respiration, saturation, staffname } = req.body;
                if (height || weight) {
                    var bmi = weight / ((height / 100) * (height / 100));
                    yield (0, vitalcharts_2.updatevitalcharts)((queryresult.vitals)[0], { bmi, height, weight, temperature, heartrate, bloodpressuresystolic, bloodpressurediastolic, respiration, saturation, staffname, status: config_1.default.status[6] });
                }
            }
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
//create vitals
//update a patient
function addencounter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //
            const { id } = req.params;
            const { email, staffId, lastName, firstName } = (req.user).user;
            let staffname = `${firstName} ${lastName}`;
            //find doctor and add doctor who examined
            const user = yield (0, users_1.readone)({ email, staffId });
            //validate id
            //validate other input paramaters
            //search appoint where appoint id = id
            //extract vitals id
            if (req.body.status == 1) {
                req.body.status = config_1.default.status[6];
            }
            else if (req.body.status == 2) {
                req.body.status = config_1.default.status[5];
            }
            else {
                req.body.status = config_1.default.status[9];
            }
            //fromclinicalencounter
            //validate empty object and initialize
            if (!((0, otherservices_1.isObjectAvailable)(req.body.medicalhistory)))
                req.body.medicalhistory = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.paediatricsspecific)))
                req.body.paediatricsspecific = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.cvs)))
                req.body.cvs = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.resp)))
                req.body.resp = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.gi)))
                req.body.gi = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.gu)))
                req.body.gu = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.neuro)))
                req.body.neuro = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.msk)))
                req.body.msk = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.medicalhistory)))
                req.body.medicalhistory = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.immunizationhistory)))
                req.body.immunizationhistory = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.developmentmilestonehistorydetails)))
                req.body.developmentmilestonehistorydetails = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.prepostnatalhistory)))
                req.body.prepostnatalhistory = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.historycvs)))
                req.body.historycvs = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.historyresp)))
                req.body.historyresp = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.historygi)))
                req.body.historygi = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.historygu)))
                req.body.historygu = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.historyneuro)))
                req.body.historyneuro = {};
            if (!((0, otherservices_1.isObjectAvailable)(req.body.historymsk)))
                req.body.historymsk = {};
            const { height, weight, temperature, bloodpressuresystolic, bloodpressurediastolic, respiration, saturation, status, additionalnote } = req.body;
            const { assessment, assessmentnote, diagosis, diagosisnote, icpc2, icpc2note } = req.body;
            const { hair, hairnote, face, facenote, jaundice, jaundicenote, cyanosis, cyanosisnote, pallor, pallornote, oral, oralnote, lymphnodes, lymphnodesnote, ederma, edermanote, lastmenstrationperiod, lastmenstrationperiodnote, generalphysicalexamination } = req.body;
            const { currentlengthheight, currentlengthheightpercentage, currentlengthheightenote, currentweight, currentweightnote, percentageofweightexpected, headcircumference, anteriorfontanelle, posteriorfontanelle, chestcircumference, limbexamination, generalnote } = (req.body).paediatricsspecific;
            const { reflexes, rootingreflexes, suckreflexes, mororeflexes, tonicneckreflexes, graspreflexes, steppingreflexes, neuronote } = (req.body).paediatricsspecific;
            const { heartrate, bpsystolic, bpdiastolic, capillaryrefilltime, heartraterhythm, heartsound, heartmurmurgrade, heartmurmurquality, heartmurmurpitch, heartmurmurtiming, murmurlocationauscultation, murmurradiatingtobodylocation, jugularveindistention, jugularveindistentionheadup30degree, edema, temperatureextrmities, tissueperfusionassessmentimpression, cvsremark } = (req.body).cvs;
            const { respiratoryrhthm, respiratoryrate, respiratoryeffort, breathsoundsauscultation, localizedbreathsounds, respiratoryassessmentimpression, respremarks } = (req.body).resp;
            const { bowelsoundauscultation, bowelsoundbyqualityauscultation, bsquadauscultation, physiologicfindingbypalpation, giassessmentimpression, giremarks } = (req.body).gi;
            const { urinecolor, urineodor, urineturbidity, urinecollectiondevice, voidingpattern, appearanceurine, otherurine, genitourinaryassessmentimpression, numbervoids, incontinentvoidsurinary, diapercount, perinealpadscount, colorurine, voidingpatterngu, bloodlossvolume, genitouringassessmentimpressions, guremark } = (req.body).gu;
            const { levelofconsciousness, person, place, time, orientationassessmentimpression, levelofarousal, speechclarity, patientmood, patientmemory, abilitytoconcentrate, abilitytodirectattention, cniexam, cniiexam, cniiiexam, cnivexam, cnvexam, cnviexam, cniviiexam, cniviiiexam, cnixexam, cnxexam, cnxiexam, cnxiiexam, pupildiametereyer, pupildiametereyel, pupillaryresponsepupilr, pupillaryresponsepupill, pupilshaperightpupil, pupilshapeleftpupil, pupilassessmentimpression, physiologicfindingopticlens, glasgowcomascale, neurologyassessmentimpression, nueroremarks } = (req.body).neuro;
            const { muscletone, musclestrength, involuntarymovements, activerangeflexionshoulderl, activerangeextensionshoulderl, activerangeexternalrotationshoulderl, activerangeinternalrotationshoulderl, activerangeabductionshoulderl, activerangeadductionshoulderl, activerangeflexionshoulderr, activerangeextensionshoulderr, activerangeexternalrotationshoulderr, activerangeinternalrotationshoulderr, activerangeabductionshoulderr, activerangeadductionshoulderr, activerangeflexionelbowl, activerangeextensionelbowl, activerangeflexionelbowr, activerangeextensionelbowr, activerangeflexionhipl, activerangeextensionhipl, activerangeexternalrotationhipl, activerangeinternalrotationhipl, activerangeabductionhipl, activerangeadductionhipl, activerangeflexionhipr, activerangeextensionhipr, activerangeexternalrotationhipr, activerangeinternalrotationhipr, activerangeabductionhipr, activerangeadductionhipr, activerangeflexionkneel, activerangeextensionkneel, activerangeflexionkneer, activerangeextensionkneer, passiverangeflexionshoulderl, passiverangeextensionshoulderl, passiverangeexternalrotationshoulderl, passiverangeinternalrotationshoulderl, passiverangeabductionshoulderl, passiverangeadductionshoulderl, passiverangeflexionshoulderr, passiverangeextensionshoulderr, passiverangeexternalrotationshoulderr, passiverangeinternalrotationshoulderr, passiverangeabductionshoulderr, passiverangeadductionshoulderr, passiverangeflexionelbowl, passiverangeextensionelbowl, passiverangeflexionelbowr, passiverangeextensionelbowr, passiverangeflexionhipl, passiverangeextensionhipl, passiverangeexternalrotationhipl, passiverangeinternalrotationhipl, passiverangeabductionhipl, passiverangeadductionhipl, passiverangeflexionhipr, passiverangeextensionhipr, passiverangeexternalrotationhipr, passiverangeinternalrotationhipr, passiverangeabductionhipr, passiverangeadductionhipr, dtrachilles, dtrbiceps, dtrbrachioradialis, dtrpatellar, dtrtriceps, babinskisreflex, oculocephalic, paralysistype, paresthesiatype, physiologicfinding, musculoskeletalassessmentimpression, mskremark, passiverangeflexionkneel, passiverangeextensionkneel, passiverangeflexionkneer, passiverangeextensionkneer } = (req.body).msk;
            const { attentiondeficitdisorderhyperactivitydisorder, attentiondeficitdisorderhyperactivitydisordernote, constipation, constipationnote, fatigue, fatiguenote, orthopedicconditions, orthopedicconditionsnote, allergies, allergiesnote, diabetes, diabetesnote, headaches, headachesnote, scoliosis, scoliosisnote, asthma, asthmanote, digestiveproblems, digestiveproblemsnote, hearingdifficulties, hearingdifficultiesnote, seizures, seizuresnote, blooddisorder, blooddisordernote, depressionanxiety, depressionanxietynote, heartproblems, heartproblemsnote, sleepdisturbances, sleepdisturbancesnote, chroniccolds, chroniccoldsnote, dyslexia, dyslexianote, kidneydisorders, kidneydisordersnote, torticollis, torticollisnote, colic, colicnote, earinfections, earinfectionsnote, lymphdisorders, lymphdisordersnote, visiondifficulties, visiondifficultiesnote, autism, autismnote, sensoryprocessingchallenges, sensoryprocessingchallengesnote } = (req.body).medicalhistory;
            const { stressors, stressorsnote, pregnancymedication, pregnancymedicationnote, cigarettealcoholuse, cigarettealcoholusenote, delivery, deliverynote, deliverytype, deliverytypenote, emergencydelivery, emergencydeliverynote, labourinduction, labourinductionnote, birthhistorymedication, birthhistorymedicationnote, assisteddelivery, assisteddeliverynote, typeofassisteddelivery, typeofassisteddeliverynote, complicationsduringdelivery, complicationsduringdeliverynote, apgarscoreafteroneminute, apgarscoreafterfiveminutes, birthweight, birthlengthheight, useofoxygenafterbirth, feedingofthechild, feedingofthechildnote, difficultyinlatchingsucking, difficultyinlatchingsuckingnote } = (req.body).prepostnatalhistory;
            const { agewhenrolledover, satupunsupported, crawled, walked, spokefirstword, spokeinsentences, totaltrianed, anyfoodallergies, contacttypesport, historyofcaraccident, everbeenseenonemergency, otherhistoryoftrauma, historyoffrequentfalls, anysignofmuscleweakness, anyfoodallergiesnote, contacttypesportnote, historyofcaraccidentnote, everbeenseenonemergencynote, otherhistoryoftraumanote, historyoffrequentfallsnote, anysignofmuscleweaknessnote } = (req.body).developmentmilestonehistorydetails;
            const { immunization, hepb0, opv0, bcg, opv1, penta1, pcv1, rota1, opv2, pcv2, rota2, opv3, penta3, pcv3, rota3, ipv, vitamina1, vitamina2, measles, yellowfever, mena, measles2, hpv914, llin } = (req.body).immunizationhistory;
            const { presentingcomplaints, presentingcompalintcode, pastmedicalhistory, drugandallergyhistory, familyandsocialhistory, nutritionhistory, spirituality } = req.body;
            const { cvsassessmentimpression, historyofcvsdisorder, historyofcvssurgicalprocedures, historycvsremark } = (req.body).historycvs;
            const { historyofrespiratorydisorders, respremark } = (req.body).historyresp;
            const { nausea, typeofdiet, giboweleliminationpattern, bmfrequency, bmusualtimeoftheday, bmregularity, usualconsistency, dateoflastbm, consistency, color, amount, appearance, historyofgidisorders, historyofsurgicalprocedureofgisystem } = (req.body).historygi;
            const { historyofgenitourinarydisorders, historyofsrgicalprocedureforgusyetm, numberstools, fluidoutputemesis, guboweleliminationpattern, consistencystool, historyguremark } = (req.body).historygu;
            const { historyofneurologicdisorders, historyofsurgicalproceduresofnervoussystem, historyneuroremark } = (req.body).historyneuro;
            const { historyofmusculoskeletaldisorders, historyofsurgicalproceduresofmsksystem, historymskremarks } = (req.body).historymsk;
            //vitals
            const vitals = { height, weight, temperature, bloodpressuresystolic, bloodpressurediastolic, respiration, saturation, bmi: req.body.bmi, status: config_1.default.status[6] };
            if (height || weight) {
                (0, otherservices_1.validateinputfornumber)({ height, weight });
                req.body.bmi = weight / ((height / 100) * (height / 100));
                //validateinputfaulsyvalue({...vitals});
            }
            //general physical examination
            const paediatricsspecificationgeneral = { currentlengthheight, currentlengthheightpercentage, currentlengthheightenote, currentweight, currentweightnote, percentageofweightexpected, headcircumference, anteriorfontanelle, posteriorfontanelle, chestcircumference, limbexamination, generalnote };
            const paediatricsspecificationneuro = { reflexes, rootingreflexes, suckreflexes, mororeflexes, tonicneckreflexes, graspreflexes, steppingreflexes, neuronote };
            const generalphysicalexaminations = { paediatricsspecification: { general: paediatricsspecificationgeneral, neuro: paediatricsspecificationneuro }, hair, hairnote, face, facenote, jaundice, jaundicenote, cyanosis, cyanosisnote, pallor, pallornote, oral, oralnote, lymphnodes, lymphnodesnote, ederma, edermanote, lastmenstrationperiod, lastmenstrationperiodnote, generalphysicalexamination };
            //assessmentdiagnosis
            const assessmentdiagnosis = { assessment, assessmentnote, diagosis, diagosisnote, icpc2, icpc2note };
            //physical exaamination  
            const cvs = { heartrate, bpsystolic, bpdiastolic, capillaryrefilltime, heartraterhythm, heartsound, heartmurmurgrade, heartmurmurquality, heartmurmurpitch, heartmurmurtiming, murmurlocationauscultation, murmurradiatingtobodylocation, jugularveindistention, jugularveindistentionheadup30degree, edema, temperatureextrmities, tissueperfusionassessmentimpression, cvsremark };
            const resp = { respiratoryrhthm, respiratoryrate, respiratoryeffort, breathsoundsauscultation, localizedbreathsounds, respiratoryassessmentimpression, respremarks };
            const gi = { bowelsoundauscultation, bowelsoundbyqualityauscultation, bsquadauscultation, physiologicfindingbypalpation, giassessmentimpression, giremarks };
            const gu = { urinecolor, urineodor, urineturbidity, urinecollectiondevice, voidingpattern, appearanceurine, otherurine, genitourinaryassessmentimpression, numbervoids, incontinentvoidsurinary, diapercount, perinealpadscount, colorurine, voidingpatterngu, bloodlossvolume, genitouringassessmentimpressions, guremark };
            const neuro = { levelofconsciousness, person, place, time, orientationassessmentimpression, levelofarousal, speechclarity, patientmood, patientmemory, abilitytoconcentrate, abilitytodirectattention, cniexam, cniiexam, cniiiexam, cnivexam, cnvexam, cnviexam, cniviiexam, cniviiiexam, cnixexam, cnxexam, cnxiexam, cnxiiexam, pupildiametereyer, pupildiametereyel, pupillaryresponsepupilr, pupillaryresponsepupill, pupilshaperightpupil, pupilshapeleftpupil, pupilassessmentimpression, physiologicfindingopticlens, glasgowcomascale, neurologyassessmentimpression, nueroremarks };
            const msk = { muscletone, musclestrength, involuntarymovements, activerangeflexionshoulderl, activerangeextensionshoulderl, activerangeexternalrotationshoulderl, activerangeinternalrotationshoulderl, activerangeabductionshoulderl, activerangeadductionshoulderl, activerangeflexionshoulderr, activerangeextensionshoulderr, activerangeexternalrotationshoulderr, activerangeinternalrotationshoulderr, activerangeabductionshoulderr, activerangeadductionshoulderr, activerangeflexionelbowl, activerangeextensionelbowl, activerangeflexionelbowr, activerangeextensionelbowr, activerangeflexionhipl, activerangeextensionhipl, activerangeexternalrotationhipl, activerangeinternalrotationhipl, activerangeabductionhipl, activerangeadductionhipl, activerangeflexionhipr, activerangeextensionhipr, activerangeexternalrotationhipr, activerangeinternalrotationhipr, activerangeabductionhipr, activerangeadductionhipr, activerangeflexionkneel, activerangeextensionkneel, activerangeflexionkneer, activerangeextensionkneer, passiverangeflexionshoulderl, passiverangeextensionshoulderl, passiverangeexternalrotationshoulderl, passiverangeinternalrotationshoulderl, passiverangeabductionshoulderl, passiverangeadductionshoulderl, passiverangeflexionshoulderr, passiverangeextensionshoulderr, passiverangeexternalrotationshoulderr, passiverangeinternalrotationshoulderr, passiverangeabductionshoulderr, passiverangeadductionshoulderr, passiverangeflexionelbowl, passiverangeextensionelbowl, passiverangeflexionelbowr, passiverangeextensionelbowr, passiverangeflexionhipl, passiverangeextensionhipl, passiverangeexternalrotationhipl, passiverangeinternalrotationhipl, passiverangeabductionhipl, passiverangeadductionhipl, passiverangeflexionhipr, passiverangeextensionhipr, passiverangeexternalrotationhipr, passiverangeinternalrotationhipr, passiverangeabductionhipr, passiverangeadductionhipr, dtrachilles, dtrbiceps, dtrbrachioradialis, dtrpatellar, dtrtriceps, babinskisreflex, oculocephalic, paralysistype, paresthesiatype, physiologicfinding, musculoskeletalassessmentimpression, mskremark, passiverangeflexionkneel, passiverangeextensionkneel, passiverangeflexionkneer, passiverangeextensionkneer };
            const physicalexamination = { cvs, resp, gi, gu, neuro, msk };
            //paediatrics
            const medicalhistory = { attentiondeficitdisorderhyperactivitydisorder, attentiondeficitdisorderhyperactivitydisordernote, constipation, constipationnote, fatigue, fatiguenote, orthopedicconditions, orthopedicconditionsnote, allergies, allergiesnote, diabetes, diabetesnote, headaches, headachesnote, scoliosis, scoliosisnote, asthma, asthmanote, digestiveproblems, digestiveproblemsnote, hearingdifficulties, hearingdifficultiesnote, seizures, seizuresnote, blooddisorder, blooddisordernote, depressionanxiety, depressionanxietynote, heartproblems, heartproblemsnote, sleepdisturbances, sleepdisturbancesnote, chroniccolds, chroniccoldsnote, dyslexia, dyslexianote, kidneydisorders, kidneydisordersnote, torticollis, torticollisnote, colic, colicnote, earinfections, earinfectionsnote, lymphdisorders, lymphdisordersnote, visiondifficulties, visiondifficultiesnote, autism, autismnote, sensoryprocessingchallenges, sensoryprocessingchallengesnote };
            const prepostnatalhistory = { stressors, stressorsnote, pregnancymedication, pregnancymedicationnote, cigarettealcoholuse, cigarettealcoholusenote, delivery, deliverynote, deliverytype, deliverytypenote, emergencydelivery, emergencydeliverynote, labourinduction, labourinductionnote, birthhistorymedication, birthhistorymedicationnote, assisteddelivery, assisteddeliverynote, typeofassisteddelivery, typeofassisteddeliverynote, complicationsduringdelivery, complicationsduringdeliverynote, apgarscoreafteroneminute, apgarscoreafterfiveminutes, birthweight, birthlengthheight, useofoxygenafterbirth, feedingofthechild, feedingofthechildnote, difficultyinlatchingsucking, difficultyinlatchingsuckingnote };
            const developmentmilestonehistorydetails = { anyfoodallergiesnote, contacttypesportnote, historyofcaraccidentnote, everbeenseenonemergencynote, otherhistoryoftraumanote, historyoffrequentfallsnote, anysignofmuscleweaknessnote, agewhenrolledover, satupunsupported, crawled, walked, spokefirstword, spokeinsentences, totaltrianed, anyfoodallergies, contacttypesport, historyofcaraccident, everbeenseenonemergency, otherhistoryoftrauma, historyoffrequentfalls, anysignofmuscleweakness };
            const immunizationhistory = { immunization, hepb0, opv0, bcg, opv1, penta1, pcv1, rota1, opv2, pcv2, rota2, opv3, penta3, pcv3, rota3, ipv, vitamina1, vitamina2, measles, yellowfever, mena, measles2, hpv914, llin };
            const paediatrics = { medicalhistory, prepostnatalhistory, developmentmilestonehistorydetails, immunizationhistory };
            //history
            const historycvs = { cvsassessmentimpression, historyofcvsdisorder, historyofcvssurgicalprocedures, historycvsremark };
            const historyresp = { historyofrespiratorydisorders, respremark };
            const historygi = { nausea, typeofdiet, giboweleliminationpattern, bmfrequency, bmusualtimeoftheday, bmregularity, usualconsistency, dateoflastbm, consistency, color, amount, appearance, historyofgidisorders, historyofsurgicalprocedureofgisystem };
            const historygu = { historyofgenitourinarydisorders, historyofsrgicalprocedureforgusyetm, numberstools, fluidoutputemesis, guboweleliminationpattern, consistencystool, historyguremark };
            const historyneuro = { historyofneurologicdisorders, historyofsurgicalproceduresofnervoussystem, historyneuroremark };
            const historymsk = { historyofmusculoskeletaldisorders, historyofsurgicalproceduresofmsksystem, historymskremarks };
            const history = { cvs: historycvs, resp: historyresp, gi: historygi, gu: historygu, neuro: historyneuro, msk: historymsk, presentingcomplaints, presentingcompalintcode, pastmedicalhistory, drugandallergyhistory, familyandsocialhistory, nutritionhistory, spirituality };
            //validateinputfaulsyvalue({...vitals});
            var queryresult;
            //find id 
            var checkadimmison = yield (0, admissions_1.readoneadmission)({ _id: id }, {}, '');
            //if not found create 
            //else update
            if (height || weight) {
                if (checkadimmison) {
                    queryresult = yield (0, appointment_1.updateappointment)(id, { $set: { 'encounter.history': history, 'encounter.paediatrics': paediatrics, 'encounter.vitals': vitals, 'encounter.generalphysicalexamination': generalphysicalexaminations, 'encounter.assessmentdiagnosis': assessmentdiagnosis, 'encounter.physicalexamination': physicalexamination }, status, additionalnote, doctor: user === null || user === void 0 ? void 0 : user._id, admission: checkadimmison._id, patient: checkadimmison.patient, fromclinicalencounter: false });
                }
                else {
                    queryresult = yield (0, appointment_1.updateappointmentbyquery)({ $or: [{ appointmentid: id }, { _id: id }] }, { $set: { 'encounter.history': history, 'encounter.paediatrics': paediatrics, 'encounter.vitals': vitals, 'encounter.generalphysicalexamination': generalphysicalexaminations, 'encounter.assessmentdiagnosis': assessmentdiagnosis, 'encounter.physicalexamination': physicalexamination }, status, additionalnote, doctor: user === null || user === void 0 ? void 0 : user._id, fromclinicalencounter: false });
                    yield (0, vitalcharts_1.createvitalcharts)({ patient: queryresult.patient, bmi: req.body.bmi, height, weight, temperature, bloodpressuresystolic, bloodpressurediastolic, respiration, saturation, staffname });
                }
            }
            else {
                if (checkadimmison) {
                    queryresult = yield (0, appointment_1.updateappointment)(id, { $set: { 'encounter.history': history, 'encounter.paediatrics': paediatrics, 'encounter.generalphysicalexamination': generalphysicalexaminations, 'encounter.assessmentdiagnosis': assessmentdiagnosis, 'encounter.physicalexamination': physicalexamination }, status, additionalnote, doctor: user === null || user === void 0 ? void 0 : user._id, admission: checkadimmison._id, patient: checkadimmison.patient, fromclinicalencounter: false });
                }
                else {
                    queryresult = yield (0, appointment_1.updateappointmentbyquery)({ $or: [{ appointmentid: id }, { _id: id }] }, { $set: { 'encounter.history': history, 'encounter.paediatrics': paediatrics, 'encounter.generalphysicalexamination': generalphysicalexaminations, 'encounter.assessmentdiagnosis': assessmentdiagnosis, 'encounter.physicalexamination': physicalexamination }, status, additionalnote, doctor: user === null || user === void 0 ? void 0 : user._id, fromclinicalencounter: false });
                }
            }
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
//get vitals per patient
const getAllVtalsByPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var selectquery = { 'encounter.vitals': 1 };
        //const {clinic} = (req.user).user;
        const { id } = req.params;
        const queryresult = yield (0, appointment_1.readallappointment)({ patient: id, $or: [{ status: config_1.default.status[5] }, { status: config_1.default.status[6] }] }, selectquery, 'patient', 'doctor', 'payment', '', '', '', '', '', '');
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.getAllVtalsByPatient = getAllVtalsByPatient;
/*
  findings: String,  // Description of the examination findings
  diagnosis: String, // Doctor's diagnosis based on the examination
  prescriptions: String,  // List of prescribed medications or treatments
  requestforlabtest: String,
  notes: String, // Additional notes (if any)
*/
//readvitals by appoiinment 
// Get all lab records
const readallvitalchartByAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let appointments = yield (0, appointment_1.readoneappointment)({ _id: id }, {}, '');
        console.log(appointments);
        const { vitals } = appointments;
        //find appointment
        const queryresult = yield (0, vitalcharts_2.readonevitalcharts)({ _id: vitals[0] }, {});
        res.status(200).json({
            queryresult,
            status: true
        });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.readallvitalchartByAppointment = readallvitalchartByAppointment;
exports.assignDoctorToAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointmentId, doctorId } = req.body;
    //change both to objectid
    // Validate inputs
    if (!appointmentId || !doctorId) {
        throw new Error("Appointment ID and Doctor ID are required.");
    }
    var _appointmentId = new ObjectId(appointmentId);
    var _doctorId = new ObjectId(doctorId);
    // Find appointment
    const appointment = yield (0, appointment_1.readoneappointment)({ _id: _appointmentId }, {}, 'patient');
    if (!appointment) {
        throw new Error("Appointment not found.");
    }
    console.log("appointment", appointment);
    // Find doctor
    const doctor = yield (0, users_1.readone)({ _id: _doctorId });
    if (!doctor) {
        throw new Error("Doctor not found.");
    }
    // Assign doctor
    appointment.doctor = doctor._id;
    appointment.doctorsfirstName = doctor.firstName;
    appointment.doctorslastName = doctor.lastName;
    appointment.doctorassigment = config_1.default.doctorassigment[1],
        yield appointment.save();
    res.status(200).json({
        queryresult: appointment,
        status: true
    });
}));
// Get all doctors in a specific clinic
exports.getDoctorsByClinic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*const { clinic } = req.params;
     // Validate inputs
      if (!clinic) {
         throw new Error("Clinic is required.");
      }
      const doctors = await readall({clinic: clinic,status:configuration.status[1],
        roleId: configuration.roles[5].roleId});
      
  
      res.status(200).json({
        status: true,
        queryresult:doctors
      });
      */
    const { clinic } = req.params;
    // Validate inputs
    if (!clinic) {
        throw new Error("Clinic is required.");
    }
    // Step 1: Get all doctors in the clinic
    const { userdetails } = yield (0, users_1.readall)({
        clinic: clinic,
        status: config_1.default.status[1],
        roleId: config_1.default.roles[5].roleId
    });
    console.log("userdetails", userdetails);
    // Step 2: Define start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
    // Step 3: Query to count patients per doctor for today
    const appointmentQuery = {
        doctor: { $ne: null },
        patient: { $ne: null },
        status: config_1.default.status[5],
        clinic,
        appointmentdate: { $gte: startOfDay, $lt: endOfDay }
    };
    const countPatientsDoctorAggregate = [
        { $match: appointmentQuery },
        {
            $group: {
                _id: "$doctor",
                uniquePatients: { $addToSet: "$patient" }
            }
        },
        {
            $project: {
                doctor: "$_id",
                _id: 0,
                patientCount: { $size: "$uniquePatients" }
            }
        }
    ];
    const { appointmentdetails } = yield (0, appointment_1.modifiedreadallappointment)(appointmentQuery, countPatientsDoctorAggregate);
    console.log("appointmentdetails", appointmentdetails);
    // Step 4: Merge counts with doctor list
    const doctorListWithCounts = userdetails.map((doc) => {
        var _a;
        const countObj = appointmentdetails.find((p) => String(p.doctor) === String(doc._id));
        return Object.assign(Object.assign({}, ((_a = doc.toObject) === null || _a === void 0 ? void 0 : _a.call(doc)) || doc), { patientCountToday: countObj ? countObj.patientCount : 0 });
    });
    // Step 5: Send response
    res.status(200).json({
        status: true,
        queryresult: doctorListWithCounts
    });
}));
//count number of patient assigment to each doctor
// controllers/appointmentController.ts
exports.countPatientsPerDoctor = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set the time to 00:00:00
    // Get the start of tomorrow to set the range for "today"
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999); // Set the time to 23:59:59  
    //const {clinic} = (req.user).user;
    const { clinic } = req.params;
    const query = {
        doctor: { $ne: null }, // Only include appointments with assigned doctors
        patient: { $ne: null }, // Only include appointments with assigned patients
        status: config_1.default.status[5],
        clinic,
        appointmentdate: { $gte: startOfDay, $lt: endOfDay }
    };
    const countpatientsdoctoraggregate = [
        {
            $match: query
        },
        {
            $group: {
                _id: "$doctor",
                uniquePatients: { $addToSet: "$patient" }
            }
        },
        {
            $project: {
                doctor: "$_id",
                _id: 0,
                patientCount: { $size: "$uniquePatients" }
            }
        }
    ];
    const queryresult = yield (0, appointment_1.modifiedreadallappointment)(query, countpatientsdoctoraggregate);
    res.status(200).json({
        status: true,
        queryresult
    });
}));
