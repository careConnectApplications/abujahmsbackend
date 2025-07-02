"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const theatreSchema = new mongoose_1.Schema({
    bedspecialization: {
        type: String,
        required: true
    },
    theatrename: {
        type: String
    },
    theatreid: {
        type: String
    },
    totalbed: {
        type: Number,
        required: true
    },
    occupiedbed: {
        type: Number,
        required: true
    },
    vacantbed: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: config_1.default.status[1],
        required: true
    }
}, { timestamps: true });
const theatre = (0, mongoose_1.model)('Theatremanagement', theatreSchema);
exports.default = theatre;
