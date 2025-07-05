"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const preoperationnoteSchema = new mongoose_1.Schema({
    diagnosispreop: String,
    diagnosisoperative: String,
    operative: String,
    surgeon: String,
    assistants: [],
    preoperativenurse: String,
    anestheticnurse: String,
    typeofanesthetic: String,
    findings: [],
    filledby: String,
    theatreadmission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Theatreadmission",
        default: null,
    }
}, { timestamps: true });
const preoperationnote = (0, mongoose_1.model)('Preoperationnote', preoperationnoteSchema);
exports.default = preoperationnote;
/*

*/
/*
diagnosis
operative
surgeon
assistants
preoperativenurse
anestheticnurse
typeofanesthetic
findings:[]
*/ 
