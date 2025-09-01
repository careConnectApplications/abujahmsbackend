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
exports.addBedFee = exports.searchAdmissionRecords = exports.referadmission = void 0;
exports.getallreferedforadmission = getallreferedforadmission;
exports.getalladmissionbypatient = getalladmissionbypatient;
exports.updateadmissionstatus = updateadmissionstatus;
const mongoose_1 = __importDefault(require("mongoose"));
const otherservices_1 = require("../../utils/otherservices");
const appointment_1 = require("../../dao/appointment");
const admissions_1 = require("../../dao/admissions");
const patientmanagement_1 = require("../../dao/patientmanagement");
const wardmanagement_1 = require("../../dao/wardmanagement");
const clinics_1 = require("../../dao/clinics");
const bed_1 = require("../../dao/bed");
const payment_1 = require("../../dao/payment");
const hmocategorycover_1 = require("../../dao/hmocategorycover");
const admission_helper_1 = require("./admission.helper");
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const { ObjectId } = mongoose_1.default.Types;
//refer for admission
var referadmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName } = (req.user).user;
        var admissionid = String(Date.now());
        //accept _id from request
        const { id } = req.params;
        //doctorname,patient,appointment
        var { alldiagnosis, referedward, admittospecialization, referddate, appointmentid, bed_id, referredIn, referredFrom } = req.body;
        (0, otherservices_1.validateinputfaulsyvalue)({ id, alldiagnosis, referedward, admittospecialization, referddate, bed_id });
        //confirm ward
        const referedwardid = new ObjectId(referedward);
        const bed = new ObjectId(bed_id);
        const foundWard = yield (0, wardmanagement_1.readonewardmanagement)({ _id: referedwardid }, '');
        if (!foundWard) {
            throw new Error(`Ward does not exist`);
        }
        const foundBed = yield (0, bed_1.readonebed)({ _id: bed, ward: foundWard._id }, '');
        if (!foundBed) {
            throw new Error(`Bed does not exist`);
        }
        //validate bed status
        if (foundBed.status == config_1.default.bedstatus[1]) {
            throw new Error(`${foundBed.bednumber} Bed is already occupied`);
        }
        //valid that bed exist
        var appointment;
        if (appointmentid) {
            appointmentid = new ObjectId(appointmentid);
            console.log("appoitmentid", appointmentid);
            appointment = yield (0, appointment_1.readoneappointment)({ _id: appointmentid }, {}, '');
            console.log("appointment", appointment);
            if (!appointment) {
                //create an appointment
                throw new Error(`Appointment does not exist`);
            }
        }
        //confrim admittospecialization
        //validate specialization
        const foundSpecilization = yield (0, clinics_1.readoneclinic)({ clinic: admittospecialization }, '');
        if (!foundSpecilization) {
            throw new Error(`Specialization does not exist`);
        }
        //find the record in patient and validate
        var patient = yield (0, patientmanagement_1.readonepatient)({ _id: id, status: config_1.default.status[1] }, {}, '', '');
        if (!patient) {
            throw new Error(`Patient does not ${config_1.default.error.erroralreadyexit} or has not made payment for registration`);
        }
        //check that patient have not been admitted
        var findAdmission = yield (0, admissions_1.readoneadmission)({ patient: patient._id, status: { $ne: config_1.default.admissionstatus[5] } }, {}, '');
        if (findAdmission) {
            throw new Error(`Patient Admission already exists`);
        }
        //create admission
        var admissionrecord = yield (0, admissions_1.createadmission)({ alldiagnosis, referedward, admittospecialization, referddate, doctorname: firstName + " " + lastName, appointment: id, patient: patient._id, admissionid, bed, referredIn, referredFrom });
        // Update ward and bed status simultaneously using Promise.all
        yield Promise.all([
            (0, wardmanagement_1.updatewardmanagement)(referedwardid, { $inc: { occupiedbed: 1, vacantbed: -1 } }),
            (0, bed_1.updatebed)(bed, { status: config_1.default.bedstatus[1] }),
            (0, patientmanagement_1.updatepatient)(patient._id, { $push: { admission: admissionrecord._id } })
        ]);
        if (appointmentid) {
            yield (0, appointment_1.updateappointment)(appointment._id, { admission: admissionrecord._id });
        }
        res.status(200).json({ queryresult: admissionrecord, status: true });
    }
    catch (error) {
        res.status(403).json({ status: false, msg: error.message });
    }
});
exports.referadmission = referadmission;
// get all admission patient
function getallreferedforadmission(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { ward } = req.params;
            const referedward = new ObjectId(ward);
            const queryresult = yield (0, admissions_1.readalladmission)({ referedward }, {}, 'referedward', 'patient', 'bed');
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
//get all admitted patient
// get all admission patient
function getalladmissionbypatient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { patient } = req.params;
            console.log(patient);
            const referedward = new ObjectId(patient);
            const queryresult = yield (0, admissions_1.readalladmission)({ patient }, {}, 'referedward', 'patient', 'bed');
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
//admited,to transfer,transfer,to discharge, discharge
function updateadmissionstatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { status } = req.body;
        try {
            if (![config_1.default.admissionstatus[3], config_1.default.admissionstatus[5]].includes(status)) {
                throw new Error(`${status} is not a valid admission status`);
            }
            //validate reason for discharge
            if (status === config_1.default.admissionstatus[5] && !req.body.dischargeReason) {
                throw new Error("Discharge reason must be provided for discharged patients");
            }
            const admission = yield (0, admissions_1.readoneadmission)({ _id: id }, {}, "");
            if (!admission)
                throw new Error("Admission not found");
            const strategy = admission_helper_1.strategies[status];
            if (!strategy)
                throw new Error(`No strategy found for status: ${status}`);
            yield strategy(admission, Object.assign(Object.assign({}, req.body), { id }));
            res.status(200).json({ status: true, message: "Successfully updated admission status" });
        }
        catch (e) {
            console.error(e);
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
exports.searchAdmissionRecords = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, MRN, HMOId } = req.query;
    // Build patient search conditions
    const patientSearchConditions = {};
    if (firstName) {
        patientSearchConditions.firstName = { $regex: new RegExp(firstName, "i") };
    }
    if (lastName) {
        patientSearchConditions.lastName = { $regex: new RegExp(lastName, "i") };
    }
    if (MRN) {
        patientSearchConditions.MRN = { $regex: new RegExp(MRN, "i") };
    }
    if (HMOId) {
        patientSearchConditions.HMOId = { $regex: new RegExp(HMOId, "i") };
    }
    var selectquery = {
        "_id": 1,
    };
    // First find matching patient IDs
    const { patientdetails } = yield (0, patientmanagement_1.readallpatient)(patientSearchConditions, selectquery, '', '');
    if (patientdetails.length === 0) {
        throw new Error("No patients found matching criteria.");
    }
    const patientIds = patientdetails.map((p) => p._id);
    // Now find admissions that match those patient IDs
    const queryresult = yield (0, admissions_1.readalladmission)({ patient: { $in: patientIds } }, {}, 'referedward', 'patient', 'bed');
    res.status(200).json({
        queryresult,
        status: true
    });
}));
exports.addBedFee = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params; // Admission ID
    const { bedfee } = req.body;
    // Validate inputs
    if (!id) {
        throw new Error("Admission ID is required.");
    }
    if (bedfee == null || isNaN(Number(bedfee))) {
        throw new Error("Valid bed fee is required.");
    }
    // Read admission (excluding discharged/completed status)
    const findAdmission = yield (0, admissions_1.readoneadmission)({ _id: id, status: { $ne: config_1.default.admissionstatus[5] } }, {}, "patient");
    if (!findAdmission) {
        throw new Error(`Patient admission does not exist`);
    }
    //validate bedfee
    if (findAdmission.bedfee)
        throw new Error("Bed has been previous generated for this patient");
    const { patient } = findAdmission;
    const paymentreference = findAdmission.admissionid;
    // Update admission record with bed fee
    const updatedAdmission = yield (0, admissions_1.updateadmission)(id, { bedfee: Number(bedfee) });
    if (!updatedAdmission) {
        throw new Error("Failed to update admission bed fee.");
    }
    // get insurance
    let insurance = yield (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: patient.insurance, category: config_1.default.category[10] }, { hmopercentagecover: 1 });
    let hmopercentagecover = (_a = insurance === null || insurance === void 0 ? void 0 : insurance.hmopercentagecover) !== null && _a !== void 0 ? _a : 0;
    let amount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(hmopercentagecover), Number(bedfee));
    if (amount > 0)
        yield (0, payment_1.createpayment)({
            firstName: patient === null || patient === void 0 ? void 0 : patient.firstName,
            lastName: patient === null || patient === void 0 ? void 0 : patient.lastName,
            MRN: patient === null || patient === void 0 ? void 0 : patient.MRN,
            phoneNumber: patient === null || patient === void 0 ? void 0 : patient.phoneNumber,
            paymentreference,
            paymentype: "bedfee",
            paymentcategory: config_1.default.category[2],
            patient: patient._id,
            amount
        });
    res.status(200).json({
        queryresult: "Bed fee added successfully.",
        status: true
    });
}));
