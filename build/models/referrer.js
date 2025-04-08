"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const diagnosis = new mongoose_1.Schema({
    diagnosis: String,
    note: String
});
const referrerSchema = new mongoose_1.Schema({
    referredclinic: String,
    referraldate: Date,
    referredby: String,
    receivingclinic: String,
    preferredconsultant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    priority: String,
    reasonforreferral: String,
    presentingcomplaints: String,
    presentingcomplaintsnotes: String,
    additionalnotes: String,
    salienthistory: String,
    findingsonexamination: String,
    investigationdoneifany: String,
    laboratoryfindings: String,
    requiredinputintervention: String,
    diagnosis: [
        diagnosis
    ],
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
    },
    status: {
        required: true,
        type: String,
        default: config_1.default.status[9],
    }
}, { timestamps: true });
const referrer = (0, mongoose_1.model)('Referrer', referrerSchema);
exports.default = referrer;
/*
referredorganization
referredunit
referraldate
receivingorganization
receivingunit
preferredconsultant
priority
reasonforreferral
presentingcomplaints
presentingcomplaintsnotes
additionalnotes
salienthistory
findingsonexamination
investigationdoneifany
laboratoryfindings
requiredinputintervention
diagnosis[
diagnosis
note
]
attachmenttype
attachment
*/ 
