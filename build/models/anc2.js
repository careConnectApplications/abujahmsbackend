"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const obstetrichistoryschema = new mongoose_1.Schema({
    year: Date,
    sexofchild: String,
    gestage: String,
    birthweight: String,
    problemsduringpregancy: String,
    problemsduringdelivery: String,
    problemsafterdelivery: String,
    placeofbirth: String,
    modeofdelivery: String,
    typeofbirth: String,
    comment: String
});
// Define the Clinic Schema
const anc2Schema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    presentingcomplaints: [],
    historyofpresentingcomplaints: [],
    historyofindexpregnancy: [],
    gynaehistory: [],
    passsurgicalhistory: [],
    drughistory: [],
    familyandsocialhistory: [],
    systematicreview: [],
    reproductiveprofile: {
        bookingstatus: String,
        lmp: Date,
        edd: Date,
        gravidity: String,
        ega: String,
        lcb: String
    },
    pastobstetrichistory: [
        obstetrichistoryschema
    ],
    generalmedicalhistory: {
        diabetesmellitus: Boolean,
        renaldisease: Boolean,
        cardiacdisease: Boolean,
        sicklecelldisease: Boolean,
        hivpositive: Boolean,
        asthma: Boolean,
        epilepsy: Boolean,
        htn: Boolean,
        scd: Boolean,
        dm: Boolean,
        anyotherseveremedicaldeseaseorconditionspecify: String
    },
    ancfollowup: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Ancfollowup",
            default: [],
        },
    ],
});
// Add indexes for performance optimization
// Single field indexes
anc2Schema.index({ patient: 1 });
anc2Schema.index({ 'reproductiveprofile.lmp': 1 });
anc2Schema.index({ 'reproductiveprofile.edd': 1 });
anc2Schema.index({ 'reproductiveprofile.bookingstatus': 1 });
// Compound indexes for common query patterns
anc2Schema.index({ patient: 1, 'reproductiveprofile.edd': 1 });
anc2Schema.index({ patient: 1, 'reproductiveprofile.lmp': 1 });
const anc2 = (0, mongoose_1.model)('Anc2', anc2Schema);
exports.default = anc2;
