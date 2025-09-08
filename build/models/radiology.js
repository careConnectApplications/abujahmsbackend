"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const radiologySchema = new mongoose_1.Schema({
    processeddate: {
        type: Date
    },
    note: {
        type: String
    },
    remark: {
        type: String
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
        type: String
        //required: true
    },
    testresult: [],
    typetestresult: [],
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    raiseby: {
        type: String,
    },
    amount: Number,
    hmopercentagecover: Number,
    actualcost: Number,
    processby: {
        type: String
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
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
// Add indexes for performance optimization
// Single field indexes
radiologySchema.index({ patient: 1 });
radiologySchema.index({ status: 1 });
radiologySchema.index({ testid: 1 });
radiologySchema.index({ createdAt: -1 });
radiologySchema.index({ payment: 1 });
radiologySchema.index({ processeddate: 1 });
// Compound indexes for common query patterns
radiologySchema.index({ patient: 1, status: 1 });
radiologySchema.index({ status: 1, createdAt: -1 });
radiologySchema.index({ testid: 1, status: 1 });
const radiology = (0, mongoose_1.model)('Radiology', radiologySchema);
exports.default = radiology;
