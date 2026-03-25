"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Unit Schema
const unitSchema = new mongoose_1.Schema({
    unit: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    clinicId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Clinic",
        default: null,
    },
}, { timestamps: true });
// Add indexes for performance optimization
unitSchema.index({ id: 1 }, { unique: true }); // Unique unit ID
unitSchema.index({ unit: 1 }); // Search by unit name
unitSchema.index({ clinicId: 1 }); // Lookup by clinic
// Compound indexes for common query patterns
unitSchema.index({ clinicId: 1, unit: 1 }); // Units by clinic and name
const unit = (0, mongoose_1.model)('Unit', unitSchema);
exports.default = unit;
