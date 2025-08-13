"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hmomanagementSchema = new mongoose_1.Schema({
    hmoname: {
        type: String
    },
    hmopercentagecover: Number,
    isprimaryhmo: {
        type: Boolean,
        default: false
    },
    id: {
        type: String,
        required: true,
    },
    insuranceId: {
        type: String, trim: true
    }
}, { timestamps: true });
const hmomanagement = (0, mongoose_1.model)('Hmomanagement', hmomanagementSchema);
exports.default = hmomanagement;
