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
    oralfluids: String,
    tubefeedingvolume: String,
    IVfluidtype: String,
    IVfluidvolume: String,
    IVfluidrate: String,
    medication: String,
    urineoutput: String,
    stoolfrequency: String,
    consistency: String,
    stoolamount: String,
    vomitamount: String,
    drainage: String,
    totalintake: String,
    totaloutput: String,
    netfliudbalancefor24hours: String,
    staffname: String,
    //updated
    datetime: Date,
    intaketype: String,
    intakeroute: String,
    intakeamount: String,
    outputtype: String,
    outputroute: String,
    outputamount: String
}, { timestamps: true });
const fluidbalance = (0, mongoose_1.model)('Fluidbalance', fluidbalanceSchema);
exports.default = fluidbalance;
