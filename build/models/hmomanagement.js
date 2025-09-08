"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hmomanagementSchema = new mongoose_1.Schema({
    hmoname: {
        type: String
    },
    id: {
        type: String,
        required: true,
    },
    insuranceId: {
        type: String, trim: true
    }
}, { timestamps: true });
// Add indexes for performance optimization
hmomanagementSchema.index({ id: 1 }, { unique: true }); // Unique HMO ID
hmomanagementSchema.index({ hmoname: 1 }); // Search by HMO name
hmomanagementSchema.index({ insuranceId: 1 }); // Search by insurance ID
// Compound indexes for common query patterns
hmomanagementSchema.index({ hmoname: 1, insuranceId: 1 }); // Search by name and insurance ID
const hmomanagement = (0, mongoose_1.model)('Hmomanagement', hmomanagementSchema);
exports.default = hmomanagement;
