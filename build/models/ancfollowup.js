"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ancfollowupSchema = new mongoose_1.Schema({
    anc: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Anc",
        default: null,
    },
    ga: String,
    sfh: String,
    wt: String,
    lie: String,
    presentation: String,
    position: String,
    fhr: String,
    urine: String,
    bp: String,
    remark: String,
    followup: String,
    riskidentified: String,
    currentmedication: String,
    staffname: String
}, { timestamps: true });
const ancfollowup = (0, mongoose_1.model)('Ancfollowup', ancfollowupSchema);
exports.default = ancfollowup;
