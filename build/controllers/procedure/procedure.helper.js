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
exports.HmoProcedureStrategy = exports.SelfPayProcedureStrategy = exports.ProcedureScheduleContext = void 0;
const procedure_1 = require("../../dao/procedure");
const price_1 = require("../../dao/price");
const appointment_1 = require("../../dao/appointment");
const patientmanagement_1 = require("../../dao/patientmanagement");
const otherservices_1 = require("../../utils/otherservices");
const payment_1 = require("../../dao/payment");
const otherservices_2 = require("../../utils/otherservices");
const config_1 = __importDefault(require("../../config"));
const ProcedureScheduleContext = (strategyFn) => ({
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () { return strategyFn(args); }),
});
exports.ProcedureScheduleContext = ProcedureScheduleContext;
const SelfPayProcedureStrategy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, procedure, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, appointmentid, raiseby, procedureid, foundPatient, hmopercentagecover, }) {
    const proceduresid = [];
    const paymentids = [];
    for (let i = 0; i < procedure.length; i++) {
        const testPrice = yield (0, price_1.readoneprice)({ servicetype: procedure[i] });
        if (!testPrice) {
            throw new Error(`${config_1.default.error.errornopriceset} ${procedure[i]}`);
        }
        // decide payment reference
        const paymentreference = yield (0, otherservices_2.getPaymentReference)(id, procedureid);
        // create payment
        const createpaymentqueryresult = yield (0, payment_1.createpayment)({
            firstName: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.firstName,
            lastName: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.lastName,
            MRN: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.MRN,
            phoneNumber: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.phoneNumber,
            paymentreference,
            paymentype: procedure[i],
            paymentcategory: config_1.default.category[5],
            patient: id,
            amount: Number(testPrice.amount),
        });
        // create procedure record
        const procedurerecord = yield (0, procedure_1.createprocedure)({
            procedure: procedure[i],
            patient: id,
            payment: createpaymentqueryresult._id,
            procedureid,
            clinic,
            indicationdiagnosisprocedure,
            appointmentdate,
            cptcodes,
            dxcodes,
            raiseby,
        });
        proceduresid.push(procedurerecord._id);
        paymentids.push(createpaymentqueryresult._id);
    }
    // update patient with procedures + payments
    let queryresult = yield (0, patientmanagement_1.updatepatient)(id, { $push: { prcedure: proceduresid, payment: paymentids } });
    // link to appointment
    if (appointmentid) {
        yield (0, appointment_1.updateappointment)(appointmentid, { $push: { procedure: proceduresid } });
    }
    return queryresult;
});
exports.SelfPayProcedureStrategy = SelfPayProcedureStrategy;
const HmoProcedureStrategy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, procedure, clinic, indicationdiagnosisprocedure, appointmentdate, cptcodes, dxcodes, appointmentid, raiseby, procedureid, hmopercentagecover, }) {
    const proceduresid = [];
    for (let i = 0; i < procedure.length; i++) {
        const testPrice = yield (0, price_1.readoneprice)({ servicetype: procedure[i] });
        if (!testPrice) {
            throw new Error(`${config_1.default.error.errornopriceset} ${procedure[i]}`);
        }
        const amount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(hmopercentagecover), Number(testPrice.amount));
        const procedurerecord = yield (0, procedure_1.createprocedure)({
            procedure: procedure[i],
            patient: id,
            procedureid,
            clinic,
            indicationdiagnosisprocedure,
            appointmentdate,
            cptcodes,
            dxcodes,
            hmopercentagecover,
            actualcost: Number(testPrice.amount),
            raiseby,
            status: config_1.default.otherstatus[0],
            amount,
        });
        proceduresid.push(procedurerecord._id);
    }
    // update patient with procedures only
    let queryresult = yield (0, patientmanagement_1.updatepatient)(id, { $push: { prcedure: proceduresid } });
    // link to appointment
    if (appointmentid) {
        yield (0, appointment_1.updateappointment)(appointmentid, { $push: { procedure: proceduresid } });
    }
    return queryresult;
});
exports.HmoProcedureStrategy = HmoProcedureStrategy;
