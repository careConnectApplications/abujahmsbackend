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
exports.LabConfirmationContext = exports.SelfPayLabConfirmationStrategy = exports.HmoLabConfirmationStrategy = void 0;
// strategies/labConfirmation.ts
const config_1 = __importDefault(require("../../config"));
const admissions_1 = require("../../dao/admissions");
const payment_1 = require("../../dao/payment");
const lab_1 = require("../../dao/lab");
const patientmanagement_1 = require("../../dao/patientmanagement");
const HmoLabConfirmationStrategy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, option, remark, lab, patient }) {
    let queryresult;
    let paymentreference;
    // Admission check for HMO patients
    const findAdmission = yield (0, admissions_1.readoneadmission)({ patient: patient._id, status: { $ne: config_1.default.admissionstatus[5] } }, {}, "");
    if (findAdmission) {
        paymentreference = findAdmission.admissionid;
    }
    else {
        paymentreference = lab.testid;
    }
    if (option && lab.amount > 0) {
        const createpaymentqueryresult = yield (0, payment_1.createpayment)({
            firstName: patient === null || patient === void 0 ? void 0 : patient.firstName,
            lastName: patient === null || patient === void 0 ? void 0 : patient.lastName,
            MRN: patient === null || patient === void 0 ? void 0 : patient.MRN,
            phoneNumber: patient === null || patient === void 0 ? void 0 : patient.phoneNumber,
            paymentreference,
            paymentype: lab.testname,
            paymentcategory: config_1.default.category[2],
            patient: patient._id,
            amount: lab.amount
        });
        queryresult = yield (0, lab_1.updatelab)({ _id: id }, {
            status: config_1.default.status[2],
            payment: createpaymentqueryresult._id,
            remark
        });
        yield (0, patientmanagement_1.updatepatient)(patient._id, {
            $push: { payment: createpaymentqueryresult._id }
        });
    }
    else if (option && lab.amount === 0) {
        queryresult = yield (0, lab_1.updatelab)({ _id: id }, { status: config_1.default.status[5], remark });
    }
    return queryresult;
});
exports.HmoLabConfirmationStrategy = HmoLabConfirmationStrategy;
const SelfPayLabConfirmationStrategy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, option, remark }) {
    if (option) {
        return yield (0, lab_1.updatelab)({ _id: id }, { status: config_1.default.otherstatus[0], remark });
    }
    else {
        return yield (0, lab_1.updatelab)({ _id: id }, { status: config_1.default.status[13], remark });
    }
});
exports.SelfPayLabConfirmationStrategy = SelfPayLabConfirmationStrategy;
// context/labConfirmationContext.ts
// Context wrapper with proper typing
const LabConfirmationContext = (strategyFn) => ({
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () { return strategyFn(args); }),
});
exports.LabConfirmationContext = LabConfirmationContext;
