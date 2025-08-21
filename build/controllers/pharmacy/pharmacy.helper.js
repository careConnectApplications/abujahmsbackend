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
exports.PharmacyOrderConfirmationContext = exports.HMOPharmacyOrderStrategy = exports.SelfPayPharmacyOrderStrategy = void 0;
exports.createPrescriptionRecord = createPrescriptionRecord;
exports.selectPharmacyOrderStrategy = selectPharmacyOrderStrategy;
const config_1 = __importDefault(require("../../config"));
const patientmanagement_1 = require("../../dao/patientmanagement");
const payment_1 = require("../../dao/payment");
const prescription_1 = require("../../dao/prescription");
const otherservices_1 = require("../../utils/otherservices");
// ✅ SelfPayPharmacyOrderStrategy
exports.SelfPayPharmacyOrderStrategy = {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, option, remark, qty, prescriptionresponse, orderPrice, patient, orderid, pharmacy, amount, }) {
            let queryresult;
            const paymentreference = yield (0, otherservices_1.getPaymentReference)(patient._id, orderid);
            if (option == true) {
                const createpaymentqueryresult = yield (0, payment_1.createpayment)({
                    firstName: patient === null || patient === void 0 ? void 0 : patient.firstName,
                    lastName: patient === null || patient === void 0 ? void 0 : patient.lastName,
                    MRN: patient === null || patient === void 0 ? void 0 : patient.MRN,
                    phoneNumber: patient === null || patient === void 0 ? void 0 : patient.phoneNumber,
                    paymentreference,
                    paymentype: prescriptionresponse.prescription,
                    paymentcategory: pharmacy,
                    patient: patient._id,
                    amount: orderPrice.amount * qty,
                    qty,
                });
                queryresult = yield (0, prescription_1.updateprescription)(id, {
                    dispensestatus: config_1.default.status[10], // dispensed
                    payment: createpaymentqueryresult._id,
                    remark,
                    qty,
                });
                yield (0, patientmanagement_1.updatepatient)(patient._id, {
                    $push: { payment: createpaymentqueryresult._id },
                });
            }
            else {
                queryresult = yield (0, prescription_1.updateprescription)(id, {
                    dispensestatus: config_1.default.status[13], // rejected
                    remark,
                });
            }
            return queryresult;
        });
    },
};
// ✅ HMOPharmacyOrderStrategy
exports.HMOPharmacyOrderStrategy = {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, option, remark, amount, hmopercentagecover, actualcost, qty }) {
            let queryresult;
            if (option == true) {
                queryresult = yield (0, prescription_1.updateprescription)(id, {
                    dispensestatus: config_1.default.otherstatus[0], // approved
                    amount,
                    remark,
                    qty,
                    hmopercentagecover,
                    actualcost,
                });
            }
            else {
                queryresult = yield (0, prescription_1.updateprescription)(id, {
                    dispensestatus: config_1.default.status[13], // rejected
                    remark,
                });
            }
            return queryresult;
        });
    },
};
// ✅ Context Function
const PharmacyOrderConfirmationContext = (strategyFn) => ({
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () { return strategyFn.execute(args); }),
});
exports.PharmacyOrderConfirmationContext = PharmacyOrderConfirmationContext;
function createPrescriptionRecord(_a) {
    return __awaiter(this, arguments, void 0, function* ({ patient, appointment, orderPrice, qty, drug, pharmacy, dosageform, strength, dosage, frequency, route, prescriptionnote, firstName, lastName, hmopercentagecover, orderid, }) {
        const actualcost = Number(orderPrice.amount) * qty;
        const amount = (0, otherservices_1.calculateAmountPaidByHMO)(Number(hmopercentagecover), Number(orderPrice.amount)) * qty;
        const prescription = yield (0, prescription_1.createprescription)({
            isHMOCover: patient === null || patient === void 0 ? void 0 : patient.isHMOCover,
            HMOPlan: patient === null || patient === void 0 ? void 0 : patient.HMOPlan,
            HMOName: patient === null || patient === void 0 ? void 0 : patient.HMOName,
            HMOId: patient === null || patient === void 0 ? void 0 : patient.HMOId,
            firstName: patient === null || patient === void 0 ? void 0 : patient.firstName,
            lastName: patient === null || patient === void 0 ? void 0 : patient.lastName,
            MRN: patient === null || patient === void 0 ? void 0 : patient.MRN,
            dispensestatus: config_1.default.otherstatus[0],
            amount,
            qty,
            pharmacy,
            duration: null,
            dosageform,
            strength,
            dosage,
            frequency,
            route,
            prescription: drug,
            patient: patient._id,
            orderid,
            prescribersname: firstName + " " + lastName,
            prescriptionnote,
            appointment: appointment._id,
            appointmentid: appointment.appointmentid,
            appointmentdate: appointment === null || appointment === void 0 ? void 0 : appointment.appointmentdate,
            clinic: appointment === null || appointment === void 0 ? void 0 : appointment.clinic,
        });
        return { prescription, actualcost, amount };
    });
}
// ✅ Step 2: Decide Strategy (HMO vs SelfPay)
function selectPharmacyOrderStrategy(patient) {
    if (patient.isHMOCover == config_1.default.ishmo[1] || patient.isHMOCover == true) {
        return exports.HMOPharmacyOrderStrategy;
    }
    else {
        return exports.SelfPayPharmacyOrderStrategy;
    }
}
