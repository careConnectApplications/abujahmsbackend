"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const servicetypeSchema = new mongoose_1.Schema({
    category: {
        type: String,
        required: true,
    },
    type: [],
    department: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const servicetype = (0, mongoose_1.model)('Servicetype', servicetypeSchema);
exports.default = servicetype;
