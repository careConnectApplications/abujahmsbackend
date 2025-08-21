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
exports.SelfPayRadiologyConfirmationStrategy = exports.HmoRadiologyConfirmationStrategy = exports.RadiologyConfirmationContext = void 0;
const config_1 = __importDefault(require("../../config"));
const payment_1 = require("../../dao/payment");
const radiology_1 = require("../../dao/radiology");
const patientmanagement_1 = require("../../dao/patientmanagement");
const otherservices_1 = require("../../utils/otherservices");
const RadiologyConfirmationContext = (strategyFn) => ({
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () { return strategyFn(args); }),
});
exports.RadiologyConfirmationContext = RadiologyConfirmationContext;
const HmoRadiologyConfirmationStrategy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, option, remark, radiology }) {
    let queryresult;
    if (option === true) {
        // HMO patient → mark as approved without payment
        queryresult = yield (0, radiology_1.updateradiology)({ _id: id }, { status: config_1.default.otherstatus[0], remark });
    }
    else {
        // Rejected
        queryresult = yield (0, radiology_1.updateradiology)({ _id: id }, { status: config_1.default.status[13], remark });
    }
    return queryresult;
});
exports.HmoRadiologyConfirmationStrategy = HmoRadiologyConfirmationStrategy;
const SelfPayRadiologyConfirmationStrategy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, option, remark, radiology, patient }) {
    let queryresult;
    const { testname, testid, amount } = radiology;
    // Decide payment reference
    const paymentreference = yield (0, otherservices_1.getPaymentReference)(patient._id, testid);
    if (option === true) {
        if (amount > 0) {
            const payment = yield (0, payment_1.createpayment)({
                firstName: patient === null || patient === void 0 ? void 0 : patient.firstName,
                lastName: patient === null || patient === void 0 ? void 0 : patient.lastName,
                MRN: patient === null || patient === void 0 ? void 0 : patient.MRN,
                phoneNumber: patient === null || patient === void 0 ? void 0 : patient.phoneNumber,
                paymentreference,
                paymentype: testname,
                paymentcategory: config_1.default.category[4],
                patient,
                amount,
            });
            queryresult = yield (0, radiology_1.updateradiology)({ _id: id }, { status: config_1.default.status[9], payment: payment._id, remark });
            yield (0, patientmanagement_1.updatepatient)(patient, { $push: { payment: payment._id } });
        }
        else {
            // amount == 0
            queryresult = yield (0, radiology_1.updateradiology)({ _id: id }, { status: config_1.default.status[9], remark });
        }
    }
    else {
        // Rejected
        queryresult = yield (0, radiology_1.updateradiology)({ _id: id }, { status: config_1.default.status[13], remark });
    }
    return queryresult;
});
exports.SelfPayRadiologyConfirmationStrategy = SelfPayRadiologyConfirmationStrategy;
