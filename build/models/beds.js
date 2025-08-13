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
const bed = (0, mongoose_1.model)('Bed', bedSchema);
exports.default = bed;
