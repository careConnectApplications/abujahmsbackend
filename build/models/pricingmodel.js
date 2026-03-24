"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pricingmodelSchema = new mongoose_1.Schema({
    pricingtype: String,
    exactnameofancclinic: String,
    exactnameofservicetypeforadult: String,
    exactnameofservicetypeforchild: String,
}, { timestamps: true });
pricingmodelSchema.index({ pricingtype: 1 }); // Search by pricing type
pricingmodelSchema.index({ exactnameofancclinic: 1 }); // Search by ANC clinic name
pricingmodelSchema.index({ exactnameofservicetypeforadult: 1 }); // Search by adult service type
pricingmodelSchema.index({ exactnameofservicetypeforchild: 1 }); // Search by child service type
// Compound indexes for common query patterns
pricingmodelSchema.index({ pricingtype: 1, exactnameofancclinic: 1 }); // Price by type and clinic
const pricingmodel = (0, mongoose_1.model)('Pricingmodel', pricingmodelSchema);
exports.default = pricingmodel;
