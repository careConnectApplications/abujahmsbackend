"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const preanatheticsSchema = new mongoose_1.Schema({
    pastmedicalhistory: String,
    presentmedicalhistory: String,
    anaestheticmedicalhistory: String,
    drugshistory: [],
    dentalhistory: String,
    familyhistory: String,
    physicalexamination: [],
    airwayassessment: String,
    mouth: String,
    neck: String,
    throidmentaldish: String,
    malamphaticscore: String,
    plan: [],
    theatreadmission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Theatreadmission",
        default: null,
    }
}, { timestamps: true });
const preanathetics = (0, mongoose_1.model)('Preanathetics', preanatheticsSchema);
exports.default = preanathetics;
/*

*/
/*
pastmedicalhistory
presentmedicalhistory
anaestheticmedicalhistory
drugshistory
dentalhistory
familyhistory
physicalexamination
airwayassessment
mouth
neck
throidmentaldish
malamphaticscore
plan
*/ 
