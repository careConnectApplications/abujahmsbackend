"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fluidbalanceSchema = new mongoose_1.Schema({
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
    intaketype: { type: String, trim: true },
    intakeroute: { type: String, trim: true },
    inputamount: { type: Number, default: 0 },
    outputtype: { type: String, trim: true },
    outputroute: { type: String, trim: true },
    netfliudbalancefor24hours: String,
    staffname: String,
    outputamount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    observationalNotes: { type: String },
    dateTo: { type: Date, },
    dateFrom: { type: Date }
}, { timestamps: true });
// Add indexes for performance optimization
// Single field indexes for primary lookups
fluidbalanceSchema.index({ patient: 1 });
fluidbalanceSchema.index({ admission: 1 });
fluidbalanceSchema.index({ referedward: 1 });
fluidbalanceSchema.index({ createdAt: -1 });
fluidbalanceSchema.index({ dateFrom: 1 });
fluidbalanceSchema.index({ dateTo: 1 });
// Compound indexes for common query patterns
fluidbalanceSchema.index({ patient: 1, createdAt: -1 }); // Patient fluid balance history
fluidbalanceSchema.index({ admission: 1, createdAt: -1 }); // Admission fluid balance history
fluidbalanceSchema.index({ patient: 1, dateFrom: 1, dateTo: 1 }); // Patient records within date range
fluidbalanceSchema.index({ referedward: 1, createdAt: -1 }); // Ward-specific records
const fluidbalance = (0, mongoose_1.model)('Fluidbalance', fluidbalanceSchema);
exports.default = fluidbalance;
