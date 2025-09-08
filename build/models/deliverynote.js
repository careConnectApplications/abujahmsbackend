"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const deliverynoteSchema = new mongoose_1.Schema({
    note: String,
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    staffname: String,
}, { timestamps: true });
// Single field indexes
deliverynoteSchema.index({ patient: 1 }); // For looking up delivery notes by patient
deliverynoteSchema.index({ createdAt: -1 }); // For sorting by date
deliverynoteSchema.index({ staffname: 1 }); // For staff-based queries
// Compound indexes for common query patterns
deliverynoteSchema.index({ patient: 1, createdAt: -1 }); // For finding recent delivery notes for a specific patient
const deliverynote = (0, mongoose_1.model)('Deliverynote', deliverynoteSchema);
exports.default = deliverynote;
