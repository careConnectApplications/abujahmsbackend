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
const unit = (0, mongoose_1.model)('Unit', unitSchema);
exports.default = unit;
