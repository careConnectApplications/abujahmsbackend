"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const clinicSchema = new mongoose_1.Schema({
    clinic: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const clinic = (0, mongoose_1.model)('Clinic', clinicSchema);
exports.default = clinic;
