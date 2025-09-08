"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const psychiatricEvaluationSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patientsmanagement',
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    admissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admission'
    },
    presentingcomplaints: [String],
    historyofpresentingcomplaints: [String],
    pastpsychiatrichistory: [String],
    pastmedicalandsurgicalhistory: [String],
    familyhistory: [String],
    personaldevelopmenthistory: [String],
    educationhistory: [String],
    occupationhistory: [String],
    psychosocialhistory: [String],
    substanceusehistory: [String],
    forensichistory: [String],
    premorbidhistory: [String],
    assessmentdiagnosis: [String],
    planmanagement: [String],
    updatedBy: String,
    createdBy: String
}, { timestamps: true });
// Add indexes for performance optimization
// Single field indexes
psychiatricEvaluationSchema.index({ patientId: 1 });
psychiatricEvaluationSchema.index({ appointmentId: 1 });
psychiatricEvaluationSchema.index({ admissionId: 1 });
psychiatricEvaluationSchema.index({ createdAt: -1 });
// Compound indexes for common query patterns
psychiatricEvaluationSchema.index({ patientId: 1, createdAt: -1 });
psychiatricEvaluationSchema.index({ appointmentId: 1, patientId: 1 });
const psychiatric = mongoose.model('PsychiatricEvaluation', psychiatricEvaluationSchema);
exports.default = psychiatric;
