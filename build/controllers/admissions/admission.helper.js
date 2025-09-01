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
exports.strategies = void 0;
const admissions_1 = require("../../dao/admissions");
const wardmanagement_1 = require("../../dao/wardmanagement");
const payment_1 = require("../../dao/payment");
const bed_1 = require("../../dao/bed");
const config_1 = __importDefault(require("../../config"));
const dischargeStrategy = (admission, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { dischargeReason, id } = reqBody;
    if (!dischargeReason) {
        throw new Error("Discharge reason must be provided for discharged patients");
    }
    /*
      const allowedReasons = ["Recovered", "Improved", "Referred Out", "Death", "Against Medical Advice", "Other"];
      if (!allowedReasons.includes(dischargeReason)) {
        throw new Error("Invalid discharge reason");
      }
    */
    // check payments
    const paymentrecord = yield (0, payment_1.readallpayment)({ paymentreference: admission.admissionid, status: { $ne: config_1.default.status[3] } }, "");
    if ((paymentrecord.paymentdetails).length > 0) {
        throw new Error(config_1.default.error.errorpayment);
    }
    // free bed + update admission
    yield Promise.all([
        (0, wardmanagement_1.updatewardmanagement)(admission.referedward, { $inc: { occupiedbed: -1, vacantbed: 1 } }),
        (0, bed_1.updatebed)(admission.bed, { status: config_1.default.bedstatus[0] }),
        (0, admissions_1.updateadmission)(id, { status: config_1.default.admissionstatus[5], dischargeReason }),
    ]);
});
const transferStrategy = (admission, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { transfterto, bed_id, id } = reqBody;
    if (!transfterto || !bed_id) {
        throw new Error("Transfer requires target ward and bed");
    }
    yield Promise.all([
        (0, wardmanagement_1.updatewardmanagement)(admission.referedward, { $inc: { occupiedbed: -1, vacantbed: 1 } }),
        (0, wardmanagement_1.updatewardmanagement)(transfterto, { $inc: { occupiedbed: 1, vacantbed: -1 } }),
        (0, bed_1.updatebed)(admission.bed, { status: config_1.default.bedstatus[0] }),
        (0, bed_1.updatebed)(bed_id, { status: config_1.default.bedstatus[1] }),
        (0, admissions_1.updateadmission)(id, {
            bed: bed_id,
            previousward: admission.referedward,
            referedward: transfterto,
        }),
    ]);
});
exports.strategies = {
    [config_1.default.admissionstatus[5]]: dischargeStrategy,
    [config_1.default.admissionstatus[3]]: transferStrategy,
};
