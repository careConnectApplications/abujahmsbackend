"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const theatreadmissionSchema = new mongoose_1.Schema({
    procedures: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Procedure",
            default: [],
        }],
    theatreadmissionid: String,
    referedtheatre: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Theatremanagement",
        default: null,
    },
    conscent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Conscenttooperation",
        default: null,
    },
    preoperativeprevisit: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Preoperativeprevisit",
        default: null,
    },
    preanathetics: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Preanathetics",
        default: null,
    },
    //preanathetics
    previoustheatre: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Theatremanagement",
        default: null,
    },
    clinic: {
        type: String
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    appointmentdate: Date,
    doctorname: {
        type: String,
        required: true
    },
    staffname: {
        type: String
    },
    status: {
        type: String,
        default: config_1.default.admissionstatus[0],
        required: true
    }
}, { timestamps: true });
const theatreadmission = (0, mongoose_1.model)('Theatreadmission', theatreadmissionSchema);
exports.default = theatreadmission;
