"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hmomanagementSchema = new mongoose_1.Schema({
    hmoname: {
        type: String
    },
    id: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const hmomanagement = (0, mongoose_1.model)('Hmomanagement', hmomanagementSchema);
exports.default = hmomanagement;
