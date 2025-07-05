"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const postanatheticrecoverychartSchema = new mongoose_1.Schema({
    score: {
        type: String,
        required: true,
    },
    timeofdischarge: {
        type: Date,
        required: true,
    },
    treatmentgiveninrecoveryroom: [],
    commentsbyrecoverynurseorwardnurse: [],
    commentsbyanaesthetist: [],
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
const postanatheticrecoverychart = (0, mongoose_1.model)('Postanatheticrecoverychart', postanatheticrecoverychartSchema);
exports.default = postanatheticrecoverychart;
