"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const anathesiaSchema = new mongoose_1.Schema({
    preopeassessment: {
        type: String,
        required: true,
    },
    allergies: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    asa: {
        type: String,
        required: true,
    },
    temp: {
        type: String,
        required: true,
    },
    premedication: {
        type: String,
        required: true,
    },
    timegivenpremedication: {
        type: Date,
        required: true,
    },
    timeoflastfood: {
        type: Date,
        required: true,
    },
    vlinesite: {
        type: String,
        required: true,
    },
    cannulasize: {
        type: String,
        required: true,
    },
    druggiven: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Druggiven",
            default: null,
        }],
    fluidsfoodgiven: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Foodgiven",
            default: null,
        }],
    technique: [],
    bloodloss: {
        type: String,
        required: true,
    },
    totalinput: {
        type: String,
        required: true,
    },
    postofinstruction: [],
    filledby: {
        type: String,
        required: true,
    },
    theatreadmission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Theatreadmission",
        default: null,
    },
}, { timestamps: true });
const anathesia = (0, mongoose_1.model)('Anathesia', anathesiaSchema);
exports.default = anathesia;
