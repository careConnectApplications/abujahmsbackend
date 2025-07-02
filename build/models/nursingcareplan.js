"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nursingcareplanSchema = new mongoose_1.Schema({
    admission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admission",
        default: null,
    },
    referedward: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wardmanagement",
        default: null,
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    nursingdiagnosis: [],
    objectives: String,
    actionintervention: String,
    evaluation: String,
    staffname: String
}, { timestamps: true });
const nursingcareplan = (0, mongoose_1.model)('Nursingcareplan', nursingcareplanSchema);
exports.default = nursingcareplan;
/*

[nursingdiagnosis: String,
objectives: String,
action/intervention:String
evaluation:String]

*/ 
