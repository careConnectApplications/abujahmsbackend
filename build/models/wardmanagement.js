"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const wardmanagementSchema = new mongoose_1.Schema({
    bedspecialization: {
        type: String,
        required: true
    },
    wardname: {
        type: String
    },
    wardid: {
        type: String
    },
    totalbed: {
        type: Number,
        required: true
    },
    occupiedbed: {
        type: Number,
        required: true
    },
    vacantbed: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: config_1.default.status[1],
        required: true
    }
}, { timestamps: true });
// Add indexes for performance optimization
// Single field indexes for primary lookups
wardmanagementSchema.index({ wardname: 1 });
wardmanagementSchema.index({ wardid: 1 });
wardmanagementSchema.index({ bedspecialization: 1 });
wardmanagementSchema.index({ status: 1 });
wardmanagementSchema.index({ vacantbed: 1 });
// Compound indexes for common query patterns
wardmanagementSchema.index({ status: 1, vacantbed: -1 }); // Active wards with available beds
wardmanagementSchema.index({ bedspecialization: 1, status: 1 }); // Wards by specialization
wardmanagementSchema.index({ wardname: 1, status: 1 }); // Ward lookup by name and status
const wardmanagement = (0, mongoose_1.model)('Wardmanagement', wardmanagementSchema);
exports.default = wardmanagement;
