"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const previouspregnancyschema = new mongoose_1.Schema({
    year: String,
    durationpregnancy: String,
    antenatalcomplication: String,
    labour: String,
    ageifalive: String,
    ageifdead: String,
    causeofdeath: String
});
// Define the Clinic Schema
const anc3Schema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    postmedicalorsurgicalhistory: [],
    pregnancysummary: {
        lmp: Date,
        edd: Date,
        gravidity: String
    },
    previouspregnancy: [
        previouspregnancyschema
    ],
    historyofpresentpregnancy: [],
    generalexamination: {
        breasts: String,
        height: String,
        cvs: String,
        rs: String,
        pelvis: String,
        abdomen: String
    },
    ancfollowup: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Ancfollowup3",
            default: [],
        },
    ],
});
const anc3 = (0, mongoose_1.model)('Anc3', anc3Schema);
exports.default = anc3;
