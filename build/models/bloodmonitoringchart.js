"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bloodmonitoringSchema = new mongoose_1.Schema({
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
    typeoftestRBSFBS: String,
    value: String,
    staffname: String,
    datetime: Date
}, { timestamps: true });
// Add indexes for performance optimization
bloodmonitoringSchema.index({ patient: 1 }); // Lookup by patient
bloodmonitoringSchema.index({ admission: 1 }); // Lookup by admission
bloodmonitoringSchema.index({ referedward: 1 }); // Lookup by ward
bloodmonitoringSchema.index({ datetime: -1 }); // Sort by date
bloodmonitoringSchema.index({ typeoftestRBSFBS: 1 }); // Filter by test type
// Compound indexes for common query patterns
bloodmonitoringSchema.index({ patient: 1, datetime: -1 }); // Patient blood monitoring by date
bloodmonitoringSchema.index({ admission: 1, datetime: -1 }); // Admission blood monitoring by date
bloodmonitoringSchema.index({ patient: 1, typeoftestRBSFBS: 1, datetime: -1 }); // Patient tests by type and date
const bloodmonitoring = (0, mongoose_1.model)('Bloodmonitoring', bloodmonitoringSchema);
exports.default = bloodmonitoring;
