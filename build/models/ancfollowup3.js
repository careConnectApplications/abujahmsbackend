"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ancfollowup3Schema = new mongoose_1.Schema({
    anc: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Anc3",
        default: null,
    },
    heightoffundus: String,
    presentationandposition: String,
    presentingpart: String,
    foetalheight: String,
    bp: String,
    hb: String,
    protein: String,
    glucose: String,
    weight: String,
    oedema: String,
    tetanustoxoid: String,
    sulfadoxinepyrimethamine: String,
    albendazole: String,
    remark: String,
    staffname: String
}, { timestamps: true });
const ancfollowup3 = (0, mongoose_1.model)('Ancfollowup3', ancfollowup3Schema);
exports.default = ancfollowup3;
