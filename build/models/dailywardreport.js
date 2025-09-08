"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dailywardreportSchema = new mongoose_1.Schema({
    ward: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wardmanagement",
        default: null,
    },
    wardreport: [],
    staffname: String,
}, { timestamps: true });
// Single field indexes
dailywardreportSchema.index({ ward: 1 }); // For looking up reports by ward
dailywardreportSchema.index({ createdAt: -1 }); // For sorting by date
dailywardreportSchema.index({ staffname: 1 }); // For staff-based queries
// Compound indexes for common query patterns
dailywardreportSchema.index({ ward: 1, createdAt: -1 }); // For finding recent reports for a specific ward
const dailywardreport = (0, mongoose_1.model)('Dailywordreport', dailywardreportSchema);
exports.default = dailywardreport;
