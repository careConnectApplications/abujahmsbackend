"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const preoperativeprevisitSchema = new mongoose_1.Schema({
    knowledgeofproposedanesthesia: String,
    previousknowledgeofproposedsurgicalintervention: String,
    presentknowledgeofproposedsurgicalintervention: String,
    conscentgained: String,
    assessoftheunknownwrite: String,
    assessthesiteoperation: String,
    skinpreparations: String,
    familyhealthhistory: String,
    vitalsignt: String,
    vitalsignp: String,
    vitalsignr: String,
    vitalsignbp: String,
    generalobservation: String,
    laboratoryinvestigations: String,
    preoperativepreparations: String,
    patientproblem: String,
    nursingdiagnosis: String,
    careinformation: String,
    theatreadmission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Theatreadmission",
        default: null,
    }
}, { timestamps: true });
const preoperativeprevisit = (0, mongoose_1.model)('Preoperativeprevisit', preoperativeprevisitSchema);
exports.default = preoperativeprevisit;
/*

*/ 
