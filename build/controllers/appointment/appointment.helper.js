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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentContext = exports.PaidAppointmentStrategy = exports.FreeAppointmentStrategy = void 0;
const insuranceclaim_1 = require("../../dao/insuranceclaim");
// Helper function to build insurance claim
function buildInsuranceClaim({ patient, serviceCategory, entityId, entityKey, authorizationCode, approvalCode, amount, createdBy, action }) {
    return {
        patient: patient._id,
        serviceCategory,
        [entityKey]: entityId,
        authorizationCode,
        approvalCode,
        amountClaimed: amount,
        amountApproved: amount,
        insurer: patient.HMOName,
        createdBy,
        action
    };
}
// strategies/paymentStrategies.ts
const FreeAppointmentStrategy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ patientrecord, appointmentid, req, configuration, services, amount, hmopercentagecover, appointmentPrice, createdBy }) {
    const { createvitalcharts, createappointment, updatepatient } = services;
    let vitals = yield createvitalcharts({ status: configuration.status[8], patient: patientrecord._id });
    let appointment = yield createappointment(Object.assign(Object.assign({}, req.body), { appointmentid, patient: patientrecord._id, vitals: vitals._id, firstName: patientrecord.firstName, lastName: patientrecord.lastName, MRN: patientrecord.MRN, HMOId: patientrecord.HMOId, HMOName: patientrecord.HMOName, amount: amount }));
    yield updatepatient(patientrecord._id, { $push: { appointment: appointment._id } });
    // Create insurance claim for HMO patients
    if (hmopercentagecover && hmopercentagecover > 0) {
        const insuranceClaim = buildInsuranceClaim({
            patient: patientrecord,
            serviceCategory: configuration.category[0], // Appointment category
            entityId: appointment._id,
            entityKey: "appointment",
            authorizationCode: "",
            approvalCode: "",
            amount,
            createdBy: createdBy,
            action: "approve",
            actualcost: appointmentPrice === null || appointmentPrice === void 0 ? void 0 : appointmentPrice.amount
        });
        yield (0, insuranceclaim_1.createInsuranceClaim)(insuranceClaim);
    }
    return appointment;
});
exports.FreeAppointmentStrategy = FreeAppointmentStrategy;
const PaidAppointmentStrategy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ patientrecord, appointmentid, req, amount, configuration, services, hmopercentagecover, appointmentPrice, createdBy }) {
    console.log("req", req.body);
    const { createpayment, createvitalcharts, createappointment, updatepatient } = services;
    let payment = yield createpayment({
        firstName: patientrecord.firstName,
        lastName: patientrecord.lastName,
        MRN: patientrecord.MRN,
        phoneNumber: patientrecord.phoneNumber,
        paymentreference: appointmentid,
        paymentype: req.body.appointmenttype,
        paymentcategory: req.body.appointmentcategory,
        patient: patientrecord._id,
        amount,
    });
    let vitals = yield createvitalcharts({ status: configuration.status[8], patient: patientrecord._id });
    let appointment = yield createappointment(Object.assign(Object.assign({}, req.body), { appointmentid, payment: payment._id, patient: patientrecord._id, vitals: vitals._id, firstName: patientrecord.firstName, lastName: patientrecord.lastName, MRN: patientrecord.MRN, HMOId: patientrecord.HMOId, HMOName: patientrecord.HMOName, amount }));
    yield updatepatient(patientrecord._id, { $push: { payment: payment._id, appointment: appointment._id } });
    // Create insurance claim for HMO patients
    if (hmopercentagecover && hmopercentagecover > 0) {
        const insuranceClaim = buildInsuranceClaim({
            patient: patientrecord,
            serviceCategory: configuration.category[0], // Appointment category
            entityId: appointment._id,
            entityKey: "appointment",
            authorizationCode: "",
            approvalCode: "",
            amount,
            createdBy: createdBy,
            action: "approve",
            actualcost: appointmentPrice === null || appointmentPrice === void 0 ? void 0 : appointmentPrice.amount
        });
        yield (0, insuranceclaim_1.createInsuranceClaim)(insuranceClaim);
    }
    return appointment;
});
exports.PaidAppointmentStrategy = PaidAppointmentStrategy;
// strategies/context.ts
const AppointmentContext = (strategyFn) => ({
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () { return strategyFn(args); }),
});
exports.AppointmentContext = AppointmentContext;
