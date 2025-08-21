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
exports.processLab = processLab;
exports.processRadiology = processRadiology;
exports.processProcedure = processProcedure;
exports.processPharmacy = processPharmacy;
exports.processHistopathology = processHistopathology;
const radiology_1 = require("../../dao/radiology");
const procedure_1 = require("../../dao/procedure");
const prescription_1 = require("../../dao/prescription");
const otherservices_1 = require("../../utils/otherservices");
const lab_1 = require("../../dao/lab");
const payment_1 = require("../../dao/payment");
const histopathology_dao_1 = require("../../dao/histopathology.dao");
const patientmanagement_1 = require("../../dao/patientmanagement");
const config_1 = __importDefault(require("../../config"));
////////////////////////   helper function for insurance claims
function handlePayment(patient, paymentData, updateFn, updateFilter, amountstatus, zeroAmountStatus, statusField) {
    return __awaiter(this, void 0, void 0, function* () {
        if (paymentData.amount > 0) {
            const createdPayment = yield (0, payment_1.createpayment)(paymentData);
            yield updateFn(updateFilter, { [statusField]: amountstatus, payment: createdPayment._id });
            yield (0, patientmanagement_1.updatepatient)(patient._id, { $push: { payment: createdPayment._id } });
            return createdPayment;
        }
        else {
            yield updateFn(updateFilter, { [statusField]: zeroAmountStatus });
            return null;
        }
    });
}
// 🔹 Generate insurance claim
function buildInsuranceClaim({ patient, serviceCategory, entityId, entityKey, authorizationCode, approvalCode, amount, createdBy }) {
    return {
        patient: patient._id,
        serviceCategory,
        [entityKey]: entityId,
        authorizationCode,
        approvalCode,
        amountClaimed: amount,
        amountApproved: amount,
        insurer: patient.HMOName,
        createdBy
    };
}
// 🔹 Common payment reference resolver
// 🟢 LAB HANDLER
function processLab(id, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authorizationCode, approvalCode, createdBy } = ctx;
        //find lab by id
        const lab = yield (0, lab_1.readonelab)({ _id: id }, {}, "patient");
        //get patient details, testname, testid, amount from lab
        const { testname, testid, patient, amount } = lab;
        //check if patient is admitted, if yes use admission number as payment reference
        const paymentreference = yield (0, otherservices_1.getPaymentReference)(patient._id, testid);
        const paymentData = {
            firstName: patient === null || patient === void 0 ? void 0 : patient.firstName,
            lastName: patient === null || patient === void 0 ? void 0 : patient.lastName,
            MRN: patient === null || patient === void 0 ? void 0 : patient.MRN,
            phoneNumber: patient === null || patient === void 0 ? void 0 : patient.phoneNumber,
            paymentreference,
            paymentype: testname,
            paymentcategory: config_1.default.category[2],
            patient: patient._id,
            amount
        };
        //create payment if amount is greater than 0
        //update lab status to processed and add payment reference
        //add payment reference to patient
        yield handlePayment(patient, paymentData, lab_1.updatelab, { _id: id }, config_1.default.status[2], config_1.default.status[5], "status");
        return buildInsuranceClaim({
            patient,
            serviceCategory: config_1.default.category[2],
            entityId: lab._id,
            entityKey: "lab",
            authorizationCode,
            approvalCode,
            amount,
            createdBy
        });
    });
}
// 🟢 RADIOLOGY HANDLER
function processRadiology(id, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authorizationCode, approvalCode, createdBy } = ctx;
        // find radiology by id
        const radiology = yield (0, radiology_1.readoneradiology)({ _id: id }, {}, "patient");
        // get patient details, testname, testid, amount from radiology
        const { testname, testid, patient, amount } = radiology;
        const paymentreference = yield (0, otherservices_1.getPaymentReference)(patient._id, testid);
        const paymentData = {
            firstName: patient === null || patient === void 0 ? void 0 : patient.firstName,
            lastName: patient === null || patient === void 0 ? void 0 : patient.lastName,
            MRN: patient === null || patient === void 0 ? void 0 : patient.MRN,
            phoneNumber: patient === null || patient === void 0 ? void 0 : patient.phoneNumber,
            paymentreference,
            paymentype: testname,
            paymentcategory: config_1.default.category[4],
            patient: patient._id,
            amount
        };
        yield handlePayment(patient, paymentData, radiology_1.updateradiology, { _id: id }, config_1.default.status[9], config_1.default.status[9], "status");
        return buildInsuranceClaim({
            patient,
            serviceCategory: config_1.default.category[4],
            entityId: radiology._id,
            entityKey: "radiology",
            authorizationCode,
            approvalCode,
            amount,
            createdBy
        });
    });
}
// 🟢 PROCEDURE HANDLER
function processProcedure(id, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authorizationCode, approvalCode, createdBy } = ctx;
        //find procedure by id
        const findprocedure = yield (0, procedure_1.readoneprocedure)({ _id: id }, {}, "patient");
        const { procedure, procedureid, patient, amount } = findprocedure;
        const paymentreference = yield (0, otherservices_1.getPaymentReference)(patient._id, procedureid);
        const paymentData = {
            firstName: patient === null || patient === void 0 ? void 0 : patient.firstName,
            lastName: patient === null || patient === void 0 ? void 0 : patient.lastName,
            MRN: patient === null || patient === void 0 ? void 0 : patient.MRN,
            phoneNumber: patient === null || patient === void 0 ? void 0 : patient.phoneNumber,
            paymentreference,
            paymentype: procedure,
            paymentcategory: config_1.default.category[5],
            patient: patient._id,
            amount
        };
        yield handlePayment(patient, paymentData, procedure_1.updateprocedure, { _id: id }, config_1.default.status[9], config_1.default.status[9], "status");
        return buildInsuranceClaim({
            patient,
            serviceCategory: config_1.default.category[5],
            entityId: findprocedure._id,
            entityKey: "procedure",
            authorizationCode,
            approvalCode,
            amount,
            createdBy
        });
    });
}
// 🟢 PHARMACY HANDLER
function processPharmacy(id, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authorizationCode, approvalCode, createdBy } = ctx;
        const findPharmacy = yield (0, prescription_1.readoneprescription)({ _id: id }, {}, 'patient', '', '');
        const { prescription, orderid, patient, amount, qty, pharmacy } = findPharmacy;
        const paymentreference = yield (0, otherservices_1.getPaymentReference)(patient._id, orderid);
        const paymentData = {
            firstName: patient === null || patient === void 0 ? void 0 : patient.firstName,
            lastName: patient === null || patient === void 0 ? void 0 : patient.lastName,
            MRN: patient === null || patient === void 0 ? void 0 : patient.MRN,
            phoneNumber: patient === null || patient === void 0 ? void 0 : patient.phoneNumber,
            paymentreference,
            paymentype: prescription,
            paymentcategory: pharmacy,
            patient: patient._id,
            amount,
            qty
        };
        yield handlePayment(patient, paymentData, prescription_1.updateprescription, { _id: id }, config_1.default.status[10], config_1.default.status[10], "dispensestatus");
        return buildInsuranceClaim({
            patient,
            serviceCategory: config_1.default.category[1],
            entityId: findPharmacy._id,
            entityKey: "pharmacy",
            authorizationCode,
            approvalCode,
            amount,
            createdBy
        });
    });
}
function processHistopathology(id, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authorizationCode, approvalCode, createdBy } = ctx;
        const findHistopathology = yield (0, histopathology_dao_1.getHistopathologyByIdPopulate)(id);
        const { patient, amount, refNumber } = findHistopathology;
        const paymentData = {
            paymentreference: refNumber,
            paymentype: config_1.default.category[6],
            paymentcategory: config_1.default.category[6], // Histopathology category
            patient: patient === null || patient === void 0 ? void 0 : patient._id,
            firstName: patient === null || patient === void 0 ? void 0 : patient.firstName,
            lastName: patient === null || patient === void 0 ? void 0 : patient.lastName,
            MRN: patient === null || patient === void 0 ? void 0 : patient.MRN,
            phoneNumber: patient === null || patient === void 0 ? void 0 : patient.phoneNumber,
            amount
        };
        yield handlePayment(patient, paymentData, histopathology_dao_1.updateHistopathologyRecord, { _id: id }, config_1.default.status[5], config_1.default.status[5], "status");
        return buildInsuranceClaim({
            patient,
            serviceCategory: config_1.default.category[6],
            entityId: findHistopathology._id,
            entityKey: "histopathology",
            authorizationCode,
            approvalCode,
            amount,
            createdBy
        });
    });
}
