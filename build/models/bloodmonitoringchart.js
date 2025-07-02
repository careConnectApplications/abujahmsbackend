"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bloodmonitoringSchema = new mongoose_1.Schema({
    admission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admission",
        default: null,
    },
    referedward: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wardmanagement",
        default: null,
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    typeoftestRBSFBS: String,
    value: String,
    staffname: String,
    datetime: Date
}, { timestamps: true });
const bloodmonitoring = (0, mongoose_1.model)('Bloodmonitoring', bloodmonitoringSchema);
exports.default = bloodmonitoring;
