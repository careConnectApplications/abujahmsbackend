"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nutitionSchema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    date: Date,
    ageinmonths: String,
    typeofvisit: String,
    infactandyoungchildfeeding: String,
    complementaryfeeding: String,
    counsellingprovided: String,
    referedtosupportgroup: String,
    anthropometryheight: String,
    anthropometryweight: String,
    anthropometrybilateraloedema: String,
    muacred: String,
    muacyellow: String,
    muacgreen: String,
    growthaccordingtothechildhealthcard: String,
    vitaminasupplement: String,
    deworming: String
}, { timestamps: true });
const nutition = (0, mongoose_1.model)('Nutition', nutitionSchema);
exports.default = nutition;
