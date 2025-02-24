"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const pathographSchema = new mongoose_1.Schema({
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    selectdate: Date,
    temperature: String,
    pulse: String,
    bloodpressuresystolic: String,
    bloodpressurediastolic: String,
    respiratoryrate: String,
    foetalheartrate: String,
    liquor: String,
    moulding: String,
    cervicaldilationb: String,
    descentofhead: String,
    contraction: String,
    doseofoxytocinadministered: String,
    urineprotein: String,
    urineacetone: String,
    urinevolume: String,
    effecement: String,
    status: {
        type: String,
        default: config_1.default.status[11]
    },
    staffname: String
}, { timestamps: true });
const pathograph = (0, mongoose_1.model)('Pathograph', pathographSchema);
exports.default = pathograph;
