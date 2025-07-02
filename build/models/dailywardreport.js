"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dailywardreportSchema = new mongoose_1.Schema({
    ward: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wardmanagement",
        default: null,
    },
    wardreport: [],
    staffname: String,
}, { timestamps: true });
const dailywardreport = (0, mongoose_1.model)('Dailywordreport', dailywardreportSchema);
exports.default = dailywardreport;
