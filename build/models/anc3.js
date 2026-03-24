"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const previouspregnancyschema = new mongoose_1.Schema({
    year: String,
<<<<<<< HEAD
    durationPregnancy: String,
    antenatalComplication: String,
    labour: String,
    puerperium: { type: String, trim: true },
    ageifdead: String,
    causeofdeath: String,
    birthWeight: { type: String, trim: true },
    sex: { type: String, trim: true },
=======
    durationpregnancy: String,
    antenatalcomplication: String,
    labour: String,
    ageifalive: String,
    ageifdead: String,
    causeofdeath: String
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
});
// Define the Clinic Schema
const anc3Schema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    postmedicalorsurgicalhistory: [],
<<<<<<< HEAD
    bookingInformation: {
        bookingDate: { type: Date },
        lmp: { type: Date },
        edd: { type: Date },
        expectedGestationalAge: { type: String, trim: true },
        gravida: { type: String, trim: true },
        indication: { type: String, trim: true },
        specialPoint: { type: String, trim: true },
        consultant: { type: String, trim: true },
        ega: { type: String, trim: true }
=======
    pregnancysummary: {
        lmp: Date,
        edd: Date,
        gravidity: String
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    },
    previouspregnancy: [
        previouspregnancyschema
    ],
    historyofpresentpregnancy: [],
<<<<<<< HEAD
    presentPregnancy: {
        bleeding: { type: String, trim: true },
        discharge: { type: String, trim: true },
        swellingAnkles: { type: String, trim: true },
        urinarySymptoms: { type: String, trim: true },
    },
    generalexamination: {
        cycle: { type: String, trim: true },
        breasts: { type: String, trim: true },
        height: { type: String, trim: true },
        weight: { type: String, trim: true },
        cvs: { type: String, trim: true },
        rs: { type: String, trim: true },
        pelvis: { type: String, trim: true },
        abdomen: { type: String, trim: true },
        retroviral: { type: String, trim: true },
        bp: { type: String, trim: true },
        urine: { type: String, trim: true },
        hb: { type: String, trim: true },
        bloodGroup: { type: String, trim: true },
        groupRh: { type: String, trim: true },
        genotype: { type: String, trim: true },
        VDRL: { type: String, trim: true },
        others: { type: String, trim: true },
        comments: { type: String, trim: true },
    },
    staffName: { type: String, trim: true },
    staffInfo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
=======
    generalexamination: {
        breasts: String,
        height: String,
        cvs: String,
        rs: String,
        pelvis: String,
        abdomen: String
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    },
    ancfollowup: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Ancfollowup3",
            default: [],
        },
    ],
<<<<<<< HEAD
}, { timestamps: true });
// Add indexes for performance optimization
// Single field indexes
anc3Schema.index({ patient: 1 });
anc3Schema.index({ 'bookingInformation.lmp': 1 });
anc3Schema.index({ 'bookingInformation.edd': 1 });
anc3Schema.index({ 'bookingInformation.bookingDate': 1 });
anc3Schema.index({ staffInfo: 1 });
anc3Schema.index({ createdAt: -1 });
// Compound indexes for common query patterns
anc3Schema.index({ patient: 1, createdAt: -1 });
anc3Schema.index({ patient: 1, 'bookingInformation.edd': 1 });
=======
});
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
const anc3 = (0, mongoose_1.model)('Anc3', anc3Schema);
exports.default = anc3;
