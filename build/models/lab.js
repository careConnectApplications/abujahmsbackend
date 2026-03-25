"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const testresultSchema = new mongoose_1.Schema({
    subcomponent: String,
    result: String,
    nranges: String,
    unit: String
});
const chemicalpathologyreportSchema = new mongoose_1.Schema({
    comment: String,
    reportedby: { type: String },
    status: String
});
const peripheralbloodfilmreportSchema = new mongoose_1.Schema({
    summary: [{ type: String }],
    redbloodcell: [{ type: String }],
    whitebloodcell: [{ type: String }],
    platelet: [{ type: String }],
    impression: [{ type: String }],
    suggestion: [{ type: String }],
    reportedby: { type: String },
    status: String
});
const ADHbonemarrowaspirationreportSchema = new mongoose_1.Schema({
    clinicalnotes: [{ type: String }],
    boneconsistency: { type: String },
    aspiration: { type: String },
    erythroidratio: { type: String },
    erythropoiesis: [{ type: String }],
    leucopoesis: [{ type: String }],
    megakaryopoiesis: [{ type: String }],
    plasmacells: [{ type: String }],
    abnomalcells: { type: String },
    ironstore: { type: String },
    conclusion: [{ type: String }], // assuming this was a typo for "conclusion"
    reportedby: { type: String },
    status: String
});
const labSchema = new mongoose_1.Schema({
    processeddate: {
        type: Date
    },
    testname: {
        type: String,
        required: true
    },
    testid: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    testresult: [testresultSchema],
    chemicalpathologyreport: chemicalpathologyreportSchema,
    peripheralbloodfilmreport: peripheralbloodfilmreportSchema,
    ADHbonemarrowaspirationreport: ADHbonemarrowaspirationreportSchema,
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    appointment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Appointment",
        default: null,
    },
    remark: {
        type: String
    },
    appointmentid: {
        type: String,
        required: true
    },
    staffname: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    raiseby: String,
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
    },
    labcategory: {
        required: true,
        type: String,
        default: "lab",
    },
    sortby: String,
    note: String,
    priority: { type: String, enum: ["urgent", "routine"] },
    sortbydate: Date,
    amount: Number,
    hmopercentagecover: Number,
    actualcost: Number,
    chemicalpathologyhemathologyreviewtstatus: {
        required: true,
        type: String,
        default: config_1.default.status[14],
    },
    status: {
        required: true,
        type: String,
        default: config_1.default.status[14],
    },
    filename: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
const lab = (0, mongoose_1.model)('Lab', labSchema);
exports.default = lab;
