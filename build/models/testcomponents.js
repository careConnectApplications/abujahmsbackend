"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Clinic Schema
const testcomponentSchema = new mongoose_1.Schema({
    testname: {
        type: String,
        required: true,
    },
    subcomponients: [],
}, { timestamps: true });
const testcomponent = (0, mongoose_1.model)('Testcomponent', testcomponentSchema);
exports.default = testcomponent;
