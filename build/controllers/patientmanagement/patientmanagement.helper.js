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
exports.PatientRegistrationContext = void 0;
exports.selectPatientStrategy = selectPatientStrategy;
const config_1 = __importDefault(require("../../config"));
const payment_1 = require("../../dao/payment");
const otherservices_1 = require("../../utils/otherservices");
const appointment_1 = require("../../dao/appointment");
const patientmanagement_1 = require("../../dao/patientmanagement");
const hmocategorycover_1 = require("../../dao/hmocategorycover");
const hmomanagement_1 = require("../../dao/hmomanagement");
const PatientRegistrationContext = (strategy) => ({
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () { return strategy.execute(args); }),
});
exports.PatientRegistrationContext = PatientRegistrationContext;
const SelfPayPatientStrategy = {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ reqBody, appointmentid, newRegistrationPrice, annualsubscriptionnewRegistrationPrice, cardfeenewRegistrationPrice, vitals }) {
            var _b;
            // Create patient
            const createpatientqueryresult = yield (0, patientmanagement_1.createpatient)(reqBody);
            // Prices
            const amount = Number(newRegistrationPrice.amount);
            const annualsubscriptionamount = Number(annualsubscriptionnewRegistrationPrice.amount);
            const cardfeeamountamount = Number(cardfeenewRegistrationPrice.amount);
            let queryappointmentresult;
            let queryresult;
            let payment = [];
            if (amount == 0 && annualsubscriptionamount == 0 && cardfeeamountamount == 0) {
                reqBody.status = config_1.default.status[1];
                if (reqBody.appointmentdate) {
                    queryappointmentresult = yield (0, appointment_1.createappointment)(Object.assign(Object.assign({}, reqBody), { appointmentid, vitals: vitals === null || vitals === void 0 ? void 0 : vitals._id, patient: createpatientqueryresult._id, MRN: createpatientqueryresult === null || createpatientqueryresult === void 0 ? void 0 : createpatientqueryresult.MRN }));
                    queryresult = yield (0, patientmanagement_1.updatepatient)(createpatientqueryresult._id, {
                        $push: { appointment: queryappointmentresult._id },
                    });
                }
                return queryresult !== null && queryresult !== void 0 ? queryresult : createpatientqueryresult;
            }
            else {
                const payments = yield Promise.all([
                    amount > 0
                        ? (0, payment_1.createpayment)(Object.assign(Object.assign({}, reqBody), { paymentreference: reqBody.MRN, paymentype: newRegistrationPrice.servicetype, paymentcategory: newRegistrationPrice.servicecategory, patient: createpatientqueryresult._id, amount }))
                        : null,
                    annualsubscriptionamount > 0
                        ? (0, payment_1.createpayment)(Object.assign(Object.assign({}, reqBody), { paymentreference: reqBody.MRN, paymentype: annualsubscriptionnewRegistrationPrice.servicetype, paymentcategory: annualsubscriptionnewRegistrationPrice.servicecategory, patient: createpatientqueryresult._id, amount: annualsubscriptionamount }))
                        : null,
                    cardfeeamountamount > 0
                        ? (0, payment_1.createpayment)(Object.assign(Object.assign({}, reqBody), { paymentreference: reqBody.MRN, paymentype: cardfeenewRegistrationPrice.servicetype, paymentcategory: cardfeenewRegistrationPrice.servicecategory, patient: createpatientqueryresult._id, amount: cardfeeamountamount }))
                        : null,
                ]);
                payments.filter(Boolean).forEach((p) => payment.push(p._id));
                if (reqBody.appointmentdate) {
                    queryappointmentresult = yield (0, appointment_1.createappointment)(Object.assign(Object.assign({}, reqBody), { appointmentid, payment: (_b = payments[0]) === null || _b === void 0 ? void 0 : _b._id, vitals: vitals === null || vitals === void 0 ? void 0 : vitals._id, patient: createpatientqueryresult._id, MRN: createpatientqueryresult === null || createpatientqueryresult === void 0 ? void 0 : createpatientqueryresult.MRN }));
                    queryresult = yield (0, patientmanagement_1.updatepatient)(createpatientqueryresult._id, {
                        payment,
                        $push: { appointment: queryappointmentresult._id },
                    });
                }
                return queryresult !== null && queryresult !== void 0 ? queryresult : createpatientqueryresult;
            }
        });
    },
};
const HMOPatientStrategy = {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ reqBody, appointmentid, newRegistrationPrice, annualsubscriptionnewRegistrationPrice, cardfeenewRegistrationPrice, vitals }) {
            var _b, _c, _d;
            let { HMOName, HMOId, HMOPlan } = reqBody;
            let gethmo = yield (0, hmomanagement_1.readonehmomanagement)({ hmoname: reqBody.HMOName }, { _id: 1, hmopercentagecover: 1 });
            reqBody.insurance = gethmo._id;
            (0, otherservices_1.validateinputfaulsyvalue)({ HMOName, HMOId, HMOPlan });
            if (!gethmo) {
                throw new Error("HMONAME does not exist");
            }
            // Create patient
            const createpatientqueryresult = yield (0, patientmanagement_1.createpatient)(reqBody);
            // Cover percentages
            const [insurance, annualsubscription, cardfee] = yield Promise.all([
                (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: gethmo === null || gethmo === void 0 ? void 0 : gethmo._id, category: config_1.default.category[3] }, { hmopercentagecover: 1 }),
                (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: gethmo === null || gethmo === void 0 ? void 0 : gethmo._id, category: config_1.default.category[8] }, { hmopercentagecover: 1 }),
                (0, hmocategorycover_1.readonehmocategorycover)({ hmoId: gethmo === null || gethmo === void 0 ? void 0 : gethmo._id, category: config_1.default.category[9] }, { hmopercentagecover: 1 }),
            ]);
            const hmopercentagecover = (_b = insurance === null || insurance === void 0 ? void 0 : insurance.hmopercentagecover) !== null && _b !== void 0 ? _b : 0;
            const annualsubscriptionhmopercentagecover = (_c = annualsubscription === null || annualsubscription === void 0 ? void 0 : annualsubscription.hmopercentagecover) !== null && _c !== void 0 ? _c : 0;
            const cardfeehmopercentagecover = (_d = cardfee === null || cardfee === void 0 ? void 0 : cardfee.hmopercentagecover) !== null && _d !== void 0 ? _d : 0;
            const amount = (0, otherservices_1.calculateAmountPaidByHMO)(hmopercentagecover, Number(newRegistrationPrice.amount));
            const annualsubscriptionamount = (0, otherservices_1.calculateAmountPaidByHMO)(annualsubscriptionhmopercentagecover, Number(annualsubscriptionnewRegistrationPrice.amount));
            const cardfeeamountamount = (0, otherservices_1.calculateAmountPaidByHMO)(cardfeehmopercentagecover, Number(cardfeenewRegistrationPrice.amount));
            let queryappointmentresult;
            let queryresult;
            let payment = [];
            if (amount == 0 && annualsubscriptionamount == 0 && cardfeeamountamount == 0) {
                reqBody.status = config_1.default.status[1];
                if (reqBody.appointmentdate) {
                    queryappointmentresult = yield (0, appointment_1.createappointment)(Object.assign(Object.assign({}, reqBody), { appointmentid, vitals: vitals === null || vitals === void 0 ? void 0 : vitals._id, patient: createpatientqueryresult._id, MRN: createpatientqueryresult === null || createpatientqueryresult === void 0 ? void 0 : createpatientqueryresult.MRN }));
                    queryresult = yield (0, patientmanagement_1.updatepatient)(createpatientqueryresult._id, {
                        $push: { appointment: queryappointmentresult._id },
                    });
                }
                return queryresult !== null && queryresult !== void 0 ? queryresult : createpatientqueryresult;
            }
            else {
                const payments = yield Promise.all([
                    amount > 0
                        ? (0, payment_1.createpayment)(Object.assign(Object.assign({}, reqBody), { paymentreference: reqBody.MRN, paymentype: newRegistrationPrice.servicetype, paymentcategory: newRegistrationPrice.servicecategory, patient: createpatientqueryresult._id, amount }))
                        : null,
                    annualsubscriptionamount > 0
                        ? (0, payment_1.createpayment)(Object.assign(Object.assign({}, reqBody), { paymentreference: reqBody.MRN, paymentype: annualsubscriptionnewRegistrationPrice.servicetype, paymentcategory: annualsubscriptionnewRegistrationPrice.servicecategory, patient: createpatientqueryresult._id, amount: annualsubscriptionamount }))
                        : null,
                    cardfeeamountamount > 0
                        ? (0, payment_1.createpayment)(Object.assign(Object.assign({}, reqBody), { paymentreference: reqBody.MRN, paymentype: cardfeenewRegistrationPrice.servicetype, paymentcategory: cardfeenewRegistrationPrice.servicecategory, patient: createpatientqueryresult._id, amount: cardfeeamountamount }))
                        : null,
                ]);
                payments.filter(Boolean).forEach((p) => payment.push(p._id));
                // HMO → no self-pay createpayment, just mark approved with zero cost
                if (reqBody.appointmentdate) {
                    queryappointmentresult = yield (0, appointment_1.createappointment)(Object.assign(Object.assign({}, reqBody), { appointmentid, vitals: vitals === null || vitals === void 0 ? void 0 : vitals._id, patient: createpatientqueryresult._id, MRN: createpatientqueryresult === null || createpatientqueryresult === void 0 ? void 0 : createpatientqueryresult.MRN }));
                    queryresult = yield (0, patientmanagement_1.updatepatient)(createpatientqueryresult._id, {
                        payment,
                        $push: { appointment: queryappointmentresult._id },
                    });
                }
                return queryresult !== null && queryresult !== void 0 ? queryresult : createpatientqueryresult;
            }
        });
    },
};
function selectPatientStrategy(isHMOCover) {
    if (isHMOCover == config_1.default.ishmo[1] || isHMOCover == true) {
        return HMOPatientStrategy;
    }
    else {
        return SelfPayPatientStrategy;
    }
}
