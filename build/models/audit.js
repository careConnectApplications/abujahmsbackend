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
//create a model
const audit = (0, mongoose_1.model)("Audit", auditSchema);
//export the model
exports.default = audit;
