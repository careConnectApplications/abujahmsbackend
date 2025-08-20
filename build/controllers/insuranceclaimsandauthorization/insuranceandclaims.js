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
exports.updateInsuranceClaimStatus = exports.fetchInsuranceClaims = exports.authorizeTransactiongroup = exports.authorizeTransaction = exports.readallbyreferenceid = exports.readallhistopathologyAwaitingAuthorization = exports.groupreadawatingauthorizationlabtransaction = exports.groupreadawatingauthorizationpharmacytransaction = exports.groupreadAwaitingAuthorizationProcedureoptimized = exports.groupreadAwaitingAuthorizationRadiologyoptimized = void 0;
const radiology_1 = require("../../dao/radiology");
const procedure_1 = require("../../dao/procedure");
const prescription_1 = require("../../dao/prescription");
const lab_1 = require("../../dao/lab");
const histopathology_dao_1 = require("../../dao/histopathology.dao");
const otherservices_1 = require("../../utils/otherservices");
const insuranceclaim_1 = require("../../dao/insuranceclaim");
const config_1 = __importDefault(require("../../config"));
const insuranceclaimandauthorization_helper_1 = require("./insuranceclaimandauthorization.helper");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
//import status from "http-status";
exports.groupreadAwaitingAuthorizationRadiologyoptimized = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var { firstName, MRN, HMOId, lastName, phoneNumber, testname } = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const filter = {};
    var statusfilter = { status: config_1.default.otherstatus[0] };
    // Add filters based on query parameters
    if (firstName) {
        filter.firstName = new RegExp(firstName, 'i'); // Case-insensitive search for name
    }
    if (MRN) {
        filter.MRN = new RegExp(MRN, 'i');
    }
    if (HMOId) {
        filter.HMOId = new RegExp(HMOId, 'i'); // Case-insensitive search for email
    }
    if (lastName) {
        filter.lastName = new RegExp(lastName, 'i'); // Case-insensitive search for email
    }
    if (phoneNumber) {
        filter.phoneNumber = new RegExp(phoneNumber, 'i'); // Case-insensitive search for email
    }
    let aggregatequery = [
        {
            $match: statusfilter
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
            $unwind: {
                path: '$patient',
                preserveNullAndEmptyArrays: true
            } // Deconstruct the patient array (from the lookup)
        },
        {
            $group: {
                _id: "$testid",
                createdAt: { $first: "$createdAt" },
                testname: { $first: "$testname" },
                testid: { $first: "$testid" },
                department: { $first: "$department" },
                raiseby: { $first: "$raiseby" },
                HMOId: { $first: "$patient.HMOId" },
                HMOName: { $first: "$patient.HMOName" },
                status: { $first: "$status" },
                totalamount: { $sum: "$amount" },
                MRN: { $first: "$patient.MRN" },
                firstName: { $first: "$patient.firstName" },
                lastName: { $first: "$patient.lastName" },
                phoneNumber: { $first: "$patient.phoneNumber" }
            }
        },
        {
            $project: {
                _id: 1,
                createdAt: 1,
                testid: 1,
                department: 1,
                raiseby: 1,
                firstName: 1,
                lastName: 1,
                phoneNumber: 1,
                MRN: 1,
                HMOId: 1,
                HMOName: 1,
                totalamount: 1,
                status: 1,
            }
        },
        {
            $match: filter
        },
    ];
    const queryresult = yield (0, radiology_1.optimizedreadallradiology)(aggregatequery, page, size);
    res.status(200).json({
        queryresult,
        status: true
    });
}));
//////////////////////procedure ////////////////////////////
exports.groupreadAwaitingAuthorizationProcedureoptimized = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var { firstName, MRN, HMOId, lastName, phoneNumber } = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const filter = {};
    var statusfilter = { status: config_1.default.otherstatus[0] };
    // Add filters based on query parameters
    if (firstName) {
        filter.firstName = new RegExp(firstName, 'i'); // Case-insensitive search for name
    }
    if (MRN) {
        filter.MRN = new RegExp(MRN, 'i');
    }
    if (HMOId) {
        filter.HMOId = new RegExp(HMOId, 'i'); // Case-insensitive search for email
    }
    if (lastName) {
        filter.lastName = new RegExp(lastName, 'i'); // Case-insensitive search for email
    }
    if (phoneNumber) {
        filter.phoneNumber = new RegExp(phoneNumber, 'i'); // Case-insensitive search for email
    }
    let aggregatequery = [
        {
            $match: statusfilter
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
            $unwind: {
                path: '$patient',
                preserveNullAndEmptyArrays: true
            } // Deconstruct the patient array (from the lookup)
        },
        {
            $group: {
                _id: "$procedureid",
                createdAt: { $first: "$createdAt" },
                procedure: { $first: "$procedure" },
                procedureid: { $first: "$procedureid" },
                raiseby: { $first: "$raiseby" },
                HMOId: { $first: "$patient.HMOId" },
                HMOName: { $first: "$patient.HMOName" },
                status: { $first: "$status" },
                totalamount: { $sum: "$amount" },
                MRN: { $first: "$patient.MRN" },
                firstName: { $first: "$patient.firstName" },
                lastName: { $first: "$patient.lastName" },
                phoneNumber: { $first: "$patient.phoneNumber" }
            }
        },
        {
            $project: {
                _id: 1,
                createdAt: 1,
                procedureid: 1,
                procedure: 1,
                raiseby: 1,
                firstName: 1,
                lastName: 1,
                phoneNumber: 1,
                MRN: 1,
                HMOId: 1,
                HMOName: 1,
                totalamount: 1,
                status: 1,
            }
        },
        {
            $match: filter
        },
    ];
    const queryresult = yield (0, procedure_1.readprocedureaggregateoptimized)(aggregatequery, page, size);
    res.status(200).json({
        queryresult,
        status: true
    });
}));
/////////////////////////pharmaccy /////////////////
exports.groupreadawatingauthorizationpharmacytransaction = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { dispensestatus: config_1.default.otherstatus[0] };
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const ordergroup = [
        //look up patient
        {
            $match: query
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
            $unwind: {
                path: "$patient",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$orderid",
                orderid: { $first: "$orderid" },
                createdAt: { $first: "$createdAt" },
                prescribersname: { $first: "$prescribersname" },
                firstName: { $first: "$patient.firstName" },
                lastName: { $first: "$patient.lastName" },
                MRN: { $first: "$patient.MRN" },
                status: { $first: "$status" },
                totalamount: { $sum: "$amount" },
                phoneNumber: { $first: "$patient.phoneNumber" },
                isHMOCover: { $first: "$patient.isHMOCover" },
                HMOName: { $first: "$patient.HMOName" },
                HMOId: { $first: "$patient.HMOId" },
                HMOPlan: { $first: "$patient.HMOPlan" },
                appointmentid: { $first: "$appointmentid" }
            },
        },
        {
            $project: {
                _id: 0,
                orderid: 1,
                createdAt: 1,
                prescribersname: 1,
                firstName: 1,
                lastName: 1,
                totalamount: 1,
                phoneNumber: 1,
                MRN: 1,
                isHMOCover: 1,
                HMOName: 1,
                HMOId: 1,
                HMOPlan: 1,
                status: 1,
                appointmentid: 1
            }
        },
        { $sort: { createdAt: -1 } },
    ];
    const queryresult = yield (0, prescription_1.optimizedreadprescriptionaggregate)(ordergroup, page, size);
    res.json({
        queryresult,
        status: true,
    });
}));
//////////////////////////////////lab ///////////////////////
exports.groupreadawatingauthorizationlabtransaction = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { status: config_1.default.otherstatus[0] };
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const queryresult = yield (0, lab_1.optimizedreadalllab)([
        {
            $match: query,
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
                _id: "$testid",
                MRN: { $first: { $first: "$patient.MRN" } },
                firstName: { $first: { $first: "$patient.firstName" } },
                lastName: { $first: { $first: "$patient.lastName" } },
                phoneNumber: { $first: { $first: "$patient.phoneNumber" } },
                isHMOCover: { $first: "$patient.isHMOCover" },
                HMOName: { $first: "$patient.HMOName" },
                HMOId: { $first: "$patient.HMOId" },
                HMOPlan: { $first: "$patient.HMOPlan" },
                appointmentid: { $first: "$appointmentid" },
                testid: { $first: "$testid" },
                status: { $first: "$status" },
                totalamount: { $sum: "$amount" },
                createdAt: { $first: "$createdAt" },
                raiseby: { $first: "$raiseby" }
            },
        },
        { $sort: { createdAt: -1 } },
    ], page, size);
    res.json({
        queryresult,
        status: true,
    });
}));
///////////////////////////////histopathology ///////////////////////
exports.readallhistopathologyAwaitingAuthorization = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    //const queryresult = await readallhistopathology({department:clinic},{},'patient','appointment','payment');
    const queryresult = yield (0, histopathology_dao_1.getAllPaginatedHistopathologyRecords)({ status: config_1.default.otherstatus[0], page, size });
    res.status(200).json({
        queryresult,
        status: true
    });
}));
///////////////////////read all by reference id ///////////////////////
exports.readallbyreferenceid = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { referencenumber } = req.query;
    const { referencecategory } = req.query;
    let queryresult;
    if (referencecategory == config_1.default.referencecategory[0]) {
        //lab
        queryresult = yield (0, lab_1.readalllab)({ testid: referencenumber, status: config_1.default.otherstatus[0] }, {}, 'patient', 'appointment', '');
    }
    else if (referencecategory == config_1.default.referencecategory[1]) {
        //radiology
        queryresult = yield (0, radiology_1.readallradiology)({ testid: referencenumber, status: config_1.default.otherstatus[0] }, {}, 'patient', '');
    }
    else if (referencecategory == config_1.default.referencecategory[2]) { //procedure
        queryresult = yield (0, procedure_1.readallprocedure)({ procedureid: referencenumber, status: config_1.default.otherstatus[0] }, {}, 'patient', '');
    }
    else if (referencecategory == config_1.default.referencecategory[3]) { //pharmacy
        //pharmacy  
        queryresult = yield (0, prescription_1.readallprescription)({ orderid: referencenumber, dispensestatus: config_1.default.otherstatus[0] }, {}, 'patient', '', '');
    }
    else {
        throw new Error("Invalid reference category");
    }
    res.status(200).json({
        queryresult,
        status: true
    });
}));
//////////////////////////authorize transaction individually   ///////////////////////
exports.authorizeTransaction = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorizationCode, approvalCode } = req.body;
    const { id, referencecategory } = req.params;
    const { _id } = (req.user).user;
    const createdBy = `${_id}`;
    (0, otherservices_1.validateinputfaulsyvalue)({ authorizationCode, approvalCode, referencecategory, id });
    let insuranceClaim = null;
    if (referencecategory === config_1.default.referencecategory[0]) {
        insuranceClaim = yield (0, insuranceclaimandauthorization_helper_1.processLab)(id, { authorizationCode, approvalCode, createdBy });
    }
    else if (referencecategory === config_1.default.referencecategory[1]) {
        insuranceClaim = yield (0, insuranceclaimandauthorization_helper_1.processRadiology)(id, { authorizationCode, approvalCode, createdBy });
    }
    else if (referencecategory === config_1.default.referencecategory[2]) {
        insuranceClaim = yield (0, insuranceclaimandauthorization_helper_1.processProcedure)(id, { authorizationCode, approvalCode, createdBy });
    }
    else if (referencecategory === config_1.default.referencecategory[3]) {
        insuranceClaim = yield (0, insuranceclaimandauthorization_helper_1.processPharmacy)(id, { authorizationCode, approvalCode, createdBy });
    }
    else if (referencecategory === config_1.default.referencecategory[4]) {
        insuranceClaim = yield (0, insuranceclaimandauthorization_helper_1.processHistopathology)(id, { authorizationCode, approvalCode, createdBy });
    }
    else {
        throw new Error("Invalid reference category");
    }
    if (insuranceClaim) {
        yield (0, insuranceclaim_1.createInsuranceClaim)(insuranceClaim);
    }
    res.status(200).json({
        queryresult: "Transaction authorized successfully",
        status: true
    });
}));
exports.authorizeTransactiongroup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorizationCode, approvalCode } = req.body;
    const { testid, referencecategory } = req.params; // 🔹 use testId instead of single id
    const { _id } = (req.user).user;
    const createdBy = `${_id}`;
    (0, otherservices_1.validateinputfaulsyvalue)({
        authorizationCode,
        approvalCode,
        referencecategory,
        testid,
    });
    let insuranceClaims = [];
    // Fetch all records that match the group testId
    let records = [];
    if (referencecategory === config_1.default.referencecategory[0]) {
        records = (yield (0, lab_1.readalllab)({ testid }, {}, '', '', '')).labdetails; // custom service to fetch labs by testId
    }
    else if (referencecategory === config_1.default.referencecategory[1]) {
        //ragiology
        records = (yield (0, radiology_1.readallradiology)({ testid }, {}, '', '')).radiologydetails;
    }
    else if (referencecategory === config_1.default.referencecategory[2]) {
        //procedure
        records = (yield (0, procedure_1.readallprocedure)({ procedureid: testid }, {}, '', '')).proceduredetails;
    }
    else if (referencecategory === config_1.default.referencecategory[3]) {
        //pharmacy
        records = (yield (0, prescription_1.readallprescription)({ orderid: testid }, {}, '', '', '')).prescriptiondetails;
    }
    else {
        throw new Error("Invalid reference category");
    }
    if (!records || records.length === 0) {
        return res.status(404).json({
            status: false,
            message: "No records found for the given testId",
        });
    }
    // Loop through group of records and process each one
    for (const record of records) {
        let insuranceClaim = null;
        if (referencecategory === config_1.default.referencecategory[0]) {
            insuranceClaim = yield (0, insuranceclaimandauthorization_helper_1.processLab)(record._id, {
                authorizationCode,
                approvalCode,
                createdBy,
            });
        }
        else if (referencecategory === config_1.default.referencecategory[1]) {
            insuranceClaim = yield (0, insuranceclaimandauthorization_helper_1.processRadiology)(record._id, {
                authorizationCode,
                approvalCode,
                createdBy,
            });
        }
        else if (referencecategory === config_1.default.referencecategory[2]) {
            insuranceClaim = yield (0, insuranceclaimandauthorization_helper_1.processProcedure)(record._id, {
                authorizationCode,
                approvalCode,
                createdBy,
            });
        }
        else if (referencecategory === config_1.default.referencecategory[3]) {
            insuranceClaim = yield (0, insuranceclaimandauthorization_helper_1.processPharmacy)(record._id, {
                authorizationCode,
                approvalCode,
                createdBy,
            });
        }
        if (insuranceClaim) {
            insuranceClaims.push(insuranceClaim);
        }
    }
    // Bulk insert claims if available
    if (insuranceClaims.length > 0) {
        yield (0, insuranceclaim_1.createInsuranceClaim)(insuranceClaims); // should accept array for bulk
    }
    res.status(200).json({
        queryresult: `${insuranceClaims.length} transactions authorized successfully`,
        status: true,
    });
}));
exports.fetchInsuranceClaims = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const query = {};
    if (req.query.status)
        query.status = req.query.status;
    if (req.query.patient)
        query.patient = req.query.patient;
    const queryresult = yield (0, insuranceclaim_1.readAllInsuranceClaims)({
        page,
        limit,
        query,
    });
    res.status(200).json({ queryresult,
        status: true });
}));
/////////// update insurance claim status////////////////
exports.updateInsuranceClaimStatus = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { claimId } = req.params;
    const { status } = req.body;
    // Ensure status is valid
    const validStatuses = ["Submitted", "Re-submitted", "Cancelled", "Rejected", "Paid"];
    if (!validStatuses.includes(status))
        throw new Error(`Invalid status. Allowed values are: ${validStatuses.join(", ")}`);
    const queryresult = yield (0, insuranceclaim_1.updateInsuranceClaimById)(claimId, { status });
    return res.status(200).json({
        status: true,
        queryresult
    });
}));
