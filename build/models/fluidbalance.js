"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fluidbalanceSchema = new mongoose_1.Schema({
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
    intaketype: { type: String, trim: true },
    intakeroute: { type: String, trim: true },
    inputamount: { type: Number, default: 0 },
    outputtype: { type: String, trim: true },
    outputroute: { type: String, trim: true },
    netfliudbalancefor24hours: String,
    staffname: String,
    outputamount: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        default: null,
    },
}, { timestamps: true });
const fluidbalance = (0, mongoose_1.model)('Fluidbalance', fluidbalanceSchema);
exports.default = fluidbalance;
