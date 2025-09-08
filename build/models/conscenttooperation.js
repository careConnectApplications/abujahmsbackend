"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const conscenttooperationSchema = new mongoose_1.Schema({
    nameofexplainer: {
        type: String,
        required: true,
    },
    filename: String,
    nameofrepresentive: {
        type: String,
        required: true,
    },
    addressofrepresentaive: {
        type: String,
        required: true,
    },
    fullnameofwitness: {
        type: String,
        required: true,
    },
    conscentdate: Date,
    theatreadmission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Theatreadmission",
        default: null,
    },
}, { timestamps: true });
// Single field indexes
conscenttooperationSchema.index({ theatreadmission: 1 }); // For looking up consent by theatre admission
conscenttooperationSchema.index({ conscentdate: -1 }); // For sorting by consent date
conscenttooperationSchema.index({ createdAt: -1 }); // For sorting by creation date
// Compound indexes for common query patterns
conscenttooperationSchema.index({ theatreadmission: 1, conscentdate: -1 }); // For finding recent consents for a specific admission
const conscenttooperation = (0, mongoose_1.model)('Conscenttooperation', conscenttooperationSchema);
exports.default = conscenttooperation;
