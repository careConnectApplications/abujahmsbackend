"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const histologyrequestSchema = new mongoose_1.Schema({
    africannonafrican: [],
    historyofpresentillness: [],
    presentingcomplaint: [],
    findingonphysicalexamination: [],
    otherfindings: [],
    anatomicalsiteofbiopsy: [],
    grossappearanceoflesion: [],
    previousreportwithnumberanddate: [],
    nameofconsultant: String,
    theatreadmission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Theatreadmission",
        default: null,
    }
}, { timestamps: true });
const histologyrequest = (0, mongoose_1.model)('Histologyrequest', histologyrequestSchema);
exports.default = histologyrequest;
