"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hmoCategoryCoverSchema = new mongoose_1.Schema({
    hmoId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hmomanagement",
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    isprimaryhmo: {
        type: Boolean,
        default: false
    },
    hmopercentagecover: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
const HmoCategoryCover = (0, mongoose_1.model)("HmoCategoryCover", hmoCategoryCoverSchema);
exports.default = HmoCategoryCover;
