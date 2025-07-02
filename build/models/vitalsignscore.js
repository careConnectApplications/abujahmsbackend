"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
consciousness
ventilation
movement
total
bp
pulserate
respiration
color
temperature
time
*/
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const vitalsignscoreSchema = new mongoose_1.Schema({
    consciousness: String,
    ventilation: String,
    movement: String,
    total: String,
    bp: String,
    pulserate: String,
    respiration: String,
    color: String,
    temperature: String,
    time: String,
    postanatheticrecoverychart: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Postanatheticrecoverychart",
        default: null,
    },
    staffname: {
        type: String
    }
}, { timestamps: true });
const vitalsignscore = (0, mongoose_1.model)('Vitalsignscore', vitalsignscoreSchema);
exports.default = vitalsignscore;
