"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// bed.model.ts
const bedSchema = new mongoose_1.Schema({
    bednumber: { type: String, required: true },
    ward: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Wardmanagement', required: true },
    status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
    isDeleted: { type: Boolean, default: false },
    assignedPatient: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', default: null },
    assignedDate: { type: Date }
}, { timestamps: true });
bedSchema.index({ bednumber: 1 });
bedSchema.index({ ward: 1 });
bedSchema.index({ status: 1 });
bedSchema.index({ assignedPatient: 1 });
bedSchema.index({ isDeleted: 1 });
bedSchema.index({ assignedDate: 1 });
// Compound indexes for common query patterns
bedSchema.index({ ward: 1, status: 1 }); // Find vacant/occupied beds in a ward
bedSchema.index({ status: 1, isDeleted: 1 }); // Available beds (vacant and not deleted)
bedSchema.index({ ward: 1, isDeleted: 1 }); // Active beds in a ward
bedSchema.index({ assignedPatient: 1, status: 1 }); // Patient bed assignment
const bed = (0, mongoose_1.model)('Bed', bedSchema);
exports.default = bed;
