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
exports.SelfPayHistopathologyCreationStrategy = exports.HMOHistopathologyCreationStrategy = exports.HistopathologyCreationContext = void 0;
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../../config"));
const otherservices_1 = require("../../utils/otherservices");
const otherservices_2 = require("../../utils/otherservices");
const payment_1 = require("../../dao/payment");
const price_1 = require("../../dao/price");
const histopathology_dao_1 = require("../../dao/histopathology.dao");
// context
const generateRefNumber = () => {
    const uniqueHistopathologyId = (0, uuid_1.v4)();
    return `histo-${new Date().getFullYear()}-${uniqueHistopathologyId}`;
};
const generateLabNumber = () => {
    const uniqueHistopathologyId = (0, uuid_1.v4)();
    return `Lab-${new Date().getFullYear()}-${uniqueHistopathologyId}`;
};
const HistopathologyCreationContext = (strategyFn) => ({
    execute: (args) => __awaiter(void 0, void 0, void 0, function* () { return strategyFn(args); })
});
exports.HistopathologyCreationContext = HistopathologyCreationContext;
// HMO strategy
const HMOHistopathologyCreationStrategy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, next, _patientId, foundPatient, hmopercentagecover, examTypes, userId, _doctorId, lmp, biopsyType, wholeOrgan, previousBiopsy, diagnosis, imageBase64, nameofexplainer, nameofrepresentive, addressofrepresentaive, fullnameofwitness, }) {
    let fileName;
    if (imageBase64)
        fileName = yield (0, otherservices_1.uploadbase64image)(imageBase64);
    let totalAmount = 0;
    let actualcost = 0;
    const testRequiredRecords = [];
    const refNumber = generateRefNumber();
    for (let i = 0; i < examTypes.length; i++) {
        const service = examTypes[i];
        const testPrice = yield (0, price_1.readoneprice)({ servicetype: service });
        if (!testPrice)
            return next(new Error(`${config_1.default.error.errornopriceset}  ${service}`));
        const serviceAmount = (0, otherservices_2.calculateAmountPaidByHMO)(Number(hmopercentagecover), Number(testPrice.amount));
        totalAmount += serviceAmount;
        actualcost += Number(testPrice.amount);
        testRequiredRecords.push({
            amount: serviceAmount,
            name: service,
            PaymentRef: null,
            paymentStatus: config_1.default.status[5] // Scheduled
        });
    }
    const labNo = generateLabNumber();
    const newHistopathology = {
        patient: _patientId,
        staffInfo: userId,
        amount: totalAmount,
        hmopercentagecover,
        actualcost,
        refNumber,
        status: config_1.default.otherstatus[0],
        paymentStatus: config_1.default.status[2],
        testRequired: testRequiredRecords,
        diagnosisForm: {
            lmp: lmp || '',
            biopsyType: biopsyType || null,
            wholeOrgan: wholeOrgan || '',
            previousBiopsy: previousBiopsy,
            diagnosis: diagnosis || '',
            labNo: labNo || '',
            requestingDoctor: _doctorId,
            phoneNumber: foundPatient.phoneNumber || null
        },
        consentForm: {
            nameofexplainer,
            nameofrepresentive,
            filename: fileName,
            addressofrepresentaive,
            fullnameofwitness,
            createdBy: userId
        }
    };
    return yield (0, histopathology_dao_1.CreateHistopatholgyDao)(newHistopathology, next);
});
exports.HMOHistopathologyCreationStrategy = HMOHistopathologyCreationStrategy;
// SelfPay strategy (uncommented payment code here)
const SelfPayHistopathologyCreationStrategy = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, next, _patientId, foundPatient, examTypes, userId, _doctorId, lmp, biopsyType, wholeOrgan, previousBiopsy, diagnosis, imageBase64, nameofexplainer, nameofrepresentive, addressofrepresentaive, fullnameofwitness, }) {
    let fileName;
    if (imageBase64)
        fileName = yield (0, otherservices_1.uploadbase64image)(imageBase64);
    let totalAmount = 0;
    const testRequiredRecords = [];
    const createdPayments = [];
    const refNumber = generateRefNumber();
    for (let i = 0; i < examTypes.length; i++) {
        const service = examTypes[i];
        const testPrice = yield (0, price_1.readoneprice)({ servicetype: service });
        if (!testPrice)
            return next(new Error(`${config_1.default.error.errornopriceset}  ${service}`));
        const serviceAmount = testPrice.amount;
        totalAmount += serviceAmount;
        const paymentData = {
            paymentreference: refNumber,
            paymentype: service,
            paymentcategory: config_1.default.category[6], // Histopathology
            patient: _patientId,
            firstName: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.firstName,
            lastName: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.lastName,
            MRN: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.MRN,
            phoneNumber: foundPatient === null || foundPatient === void 0 ? void 0 : foundPatient.phoneNumber,
            amount: Number(serviceAmount),
        };
        testRequiredRecords.push({
            amount: serviceAmount,
            name: service,
            PaymentRef: null,
            paymentStatus: config_1.default.status[5], // Scheduled
        });
        createdPayments.push(paymentData);
    }
    // create payments and attach refs
    for (let i = 0; i < createdPayments.length; i++) {
        const paymentRecord = yield (0, payment_1.createpayment)(createdPayments[i]);
        testRequiredRecords[i].PaymentRef = paymentRecord._id;
    }
    const labNo = generateLabNumber();
    const newHistopathology = {
        patient: _patientId,
        staffInfo: userId,
        amount: totalAmount,
        refNumber,
        status: config_1.default.status[5],
        paymentStatus: config_1.default.status[2],
        testRequired: testRequiredRecords,
        diagnosisForm: {
            lmp: lmp || '',
            biopsyType: biopsyType || null,
            wholeOrgan: wholeOrgan || '',
            previousBiopsy: previousBiopsy,
            diagnosis: diagnosis || '',
            labNo: labNo || '',
            requestingDoctor: _doctorId,
            phoneNumber: foundPatient.phoneNumber || null
        },
        consentForm: {
            nameofexplainer,
            nameofrepresentive,
            filename: fileName,
            addressofrepresentaive,
            fullnameofwitness,
            createdBy: userId
        }
    };
    return yield (0, histopathology_dao_1.CreateHistopatholgyDao)(newHistopathology, next);
});
exports.SelfPayHistopathologyCreationStrategy = SelfPayHistopathologyCreationStrategy;
// Controller/service
