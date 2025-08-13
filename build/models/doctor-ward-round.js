"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const doctorWardRoundSchema = new mongoose_1.Schema({
    admissionId: {
        type: String,
        required: [true, 'Admission ID is required'],
        trim: true,
        index: true
    },
    admissionNote: {
        type: String,
        required: [true, 'Admission note is required'],
        trim: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Creator ID is required']
    }
}, { timestamps: true });
doctorWardRoundSchema.pre(/^find/, function (next) {
    this.populate({
        path: "admissionId createdBy",
    });
    next();
});
const DoctorWardRound = (0, mongoose_1.model)("DoctorWardRound", doctorWardRoundSchema);
exports.default = DoctorWardRound;
