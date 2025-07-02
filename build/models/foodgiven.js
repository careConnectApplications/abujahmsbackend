"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const foodgivenSchema = new mongoose_1.Schema({
    foodgiven: {
        type: String,
        required: true,
    },
    timegiven: {
        type: Date,
        required: true,
    },
    bp: {
        type: String,
        required: true,
    },
    pulse: {
        type: String,
        required: true,
    },
    temp: {
        type: String,
        required: true,
    },
    anathesia: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Anathesia",
        default: null,
    },
    staffname: {
        type: String
    }
}, { timestamps: true });
const foodgiven = (0, mongoose_1.model)('Foodgiven', foodgivenSchema);
exports.default = foodgiven;
