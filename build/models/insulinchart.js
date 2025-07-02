"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const insulinSchema = new mongoose_1.Schema({
    admission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admission",
        default: null,
    },
    referedward: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wardmanagement",
        default: null,
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
    },
    dateandtimeofbloodglucosemonitoring: Date,
    premealbloodglucoselevel: String,
    postmealbloodglucoselevel: String,
    fastingbloodglucose: String,
    dateandtimeofinsulinadministration: Date,
    timeofinsulinadministration: String,
    typeofinsulin: String,
    dosage: String,
    route: String,
    rbsvalue: String,
    mealtimes: String,
    carbonhydrateintakeestimation: String,
    symtoms: String,
    interventionprovided: String,
    staffname: String,
}, { timestamps: true });
const insulin = (0, mongoose_1.model)('Insulin', insulinSchema);
exports.default = insulin;
