"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const immunizationSchema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    anynotedadverseeffect: {
        type: String,
        default: config_1.default.anynotedadverseeffect[1],
    },
    adverseeffectseverity: String,
    medicationgiventomanageadverseeffect: String,
    vaccination: String,
    schedule: String,
    vaccinecode: String,
    vaccinename: String,
    vaccinetype: String,
    manufacturer: String,
    batchno: String,
    expirydate: Date,
    dose: String,
    doseamount: String,
    administrationsite: String,
    administrationroute: String,
    consent: String,
    immunizationstatus: String,
    comment: String,
    //adverseeventdescription:String,
    onsetdateofreaction: Date,
    reactcode: String,
    reporter: String,
    reportingsource: String,
    staffname: String
}, { timestamps: true });
const immunization = (0, mongoose_1.model)('Immunization', immunizationSchema);
exports.default = immunization;
