"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const druggivenSchema = new mongoose_1.Schema({
    druggiven: {
        type: String,
        required: true,
    },
    timegiven: {
        type: Date,
        required: true,
    },
    bp: {
        type: String,
        required: true,
    },
    pulse: {
        type: String,
        required: true,
    },
    temp: {
        type: String,
        required: true,
    },
    anathesia: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Anathesia",
        default: null,
    },
    staffname: {
        type: String
    }
}, { timestamps: true });
druggivenSchema.index({ anathesia: 1 }); // For looking up drugs given for a specific anesthesia
druggivenSchema.index({ timegiven: -1 }); // For sorting by administration time
druggivenSchema.index({ staffname: 1 }); // For staff-based queries
druggivenSchema.index({ createdAt: -1 }); // For sorting by creation date
// Compound indexes for common query patterns
druggivenSchema.index({ anathesia: 1, timegiven: -1 }); // For finding recent drug administrations for a specific anesthesia
const druggiven = (0, mongoose_1.model)('Druggiven', druggivenSchema);
exports.default = druggiven;
