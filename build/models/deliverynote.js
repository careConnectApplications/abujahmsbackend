"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const deliverynoteSchema = new mongoose_1.Schema({
    note: String,
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    staffname: String,
}, { timestamps: true });
const deliverynote = (0, mongoose_1.model)('Deliverynote', deliverynoteSchema);
exports.default = deliverynote;
