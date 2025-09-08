"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//create schema
const auditSchema = new mongoose_1.Schema({
    action: {
        required: true,
        type: String
    },
    actor: {
        required: true,
        type: String,
    },
    affectedentity: {
        required: true,
        type: String,
    }
}, { timestamps: true });
// Add indexes for performance optimization
auditSchema.index({ actor: 1 }); // Search by actor/user
auditSchema.index({ action: 1 }); // Search by action type
auditSchema.index({ affectedentity: 1 }); // Search by affected entity
auditSchema.index({ createdAt: -1 }); // Sort by creation date (descending)
// Compound indexes for common query patterns
auditSchema.index({ actor: 1, createdAt: -1 }); // Audit trail by user
auditSchema.index({ action: 1, createdAt: -1 }); // Actions by type and date
auditSchema.index({ affectedentity: 1, createdAt: -1 }); // Entity audit history
auditSchema.index({ actor: 1, action: 1, createdAt: -1 }); // Full audit trail queries
//create a model
const audit = (0, mongoose_1.model)("Audit", auditSchema);
//export the model
exports.default = audit;
