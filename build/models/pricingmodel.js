"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pricingmodelSchema = new mongoose_1.Schema({
    pricingtype: String,
    exactnameofancclinic: String,
    exactnameofservicetypeforadult: String,
    exactnameofservicetypeforchild: String,
}, { timestamps: true });
const pricingmodel = (0, mongoose_1.model)('Pricingmodel', pricingmodelSchema);
exports.default = pricingmodel;
