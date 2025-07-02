"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const feedingtubechartSchema = new mongoose_1.Schema({
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
    Datetimefeeds: Date,
    amount: String,
    feed: String,
    staffname: String,
}, { timestamps: true });
const feedingtubechart = (0, mongoose_1.model)('Feedingtubechart', feedingtubechartSchema);
exports.default = feedingtubechart;
