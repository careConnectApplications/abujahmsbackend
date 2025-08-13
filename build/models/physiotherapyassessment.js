"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const physiotherapyAssessmentSchema = new mongoose_1.Schema({
    // 1. Subjective Assessment
    clinicalassessment: {
        chiefComplaint: [String],
        historyOfPresentCondition: [String],
        medicalHistory: [String],
        surgicalHistory: [String],
        medications: [String],
        previousTreatments: [String],
    },
    // 2. Physical Examination and Objective Findings
    physicalexamination: {
        bloodPressure: String,
        pulse: String,
        respiratoryRate: String,
        temperature: String,
        muscleStrengthTesting: [String],
        posturalAssessment: [String],
        gaitAnalysis: [String],
        palpationFindings: [String],
        specialTests: [String],
    },
    // 3. Functional Assessment and Outcome Measures
    functionalLimitations: [String],
    outcomeMeasures: {
        visualAnalogScaleForPain: String,
        oswestryDisabilityIndex: String,
        timeUpAndGoTest: String,
        sixMinutesWalkTest: String,
        outcomeMeasureNotes: [String],
    },
    // 4. Diagnosis and Clinical Impression
    diagnosisandclinicalImpression: {
        diagnosisICDEleven: [String],
        primaryDiagnosisNotes: [String],
        secondaryDiagnosisNotes: [String],
        clinicalImpressions: [String],
    },
    // 5. Treatment Plan and Goals
    treatmentplanandgoals: {
        shortTermGoals: [String],
        longTermGoals: [String],
        intervention: [String],
    },
    rangeofmotion: {
        affectedBodyPart: { type: String },
        slideOfBody: { type: String },
        jointName: { type: String },
        movementType: {
            type: String,
            enum: [
                "Flexion",
                "Extension",
                "Abduction",
                "Adduction",
                "Internal",
                "External",
                "Circumduction",
                "Elevation",
                "Depression"
            ]
        },
        activeRangeOfMotion: { type: String },
        passiveRangeOfMotion: { type: String },
        normalRangeOfMotion: { type: String },
        ROMDeficit: { type: String },
        painLevelDuringMovement: {
            type: String,
            enum: ["1", "2", "3", "4", "5", "6"]
        },
        endFeel: { type: String },
        assessmentToolUsed: { type: String },
        functionalImpact: { type: String },
        progressNotes: { type: String },
        notes: [{ type: String }]
    },
    createdBy: String,
    updatedBy: String,
    patientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Patientsmanagement',
        required: true
    },
    appointmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    admissionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Admission'
    },
}, {
    timestamps: true
});
const PhysiotherapyAssessment = mongoose_1.default.model("PhysiotherapyAssessment", physiotherapyAssessmentSchema);
exports.default = PhysiotherapyAssessment;
