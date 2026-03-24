import { Schema, model } from "mongoose";
import configuration from "../config";
const pricingmodelSchema = new Schema({
      pricingtype:String, 
      exactnameofancclinic:String,
      exactnameofservicetypeforadult:String,
      exactnameofservicetypeforchild: String,
},
{ timestamps: true }
);

<<<<<<< HEAD
// Add indexes for performance optimization
pricingmodelSchema.index({ pricingtype: 1 }); // Search by pricing type
pricingmodelSchema.index({ exactnameofancclinic: 1 }); // Search by ANC clinic name
pricingmodelSchema.index({ exactnameofservicetypeforadult: 1 }); // Search by adult service type
pricingmodelSchema.index({ exactnameofservicetypeforchild: 1 }); // Search by child service type

// Compound indexes for common query patterns
pricingmodelSchema.index({ pricingtype: 1, exactnameofancclinic: 1 }); // Price by type and clinic

const pricingmodel= model('Pricingmodel', pricingmodelSchema);
export default pricingmodel;
=======
const pricingmodel= model('Pricingmodel', pricingmodelSchema);
export default pricingmodel;



>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
