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

const pricingmodel= model('Pricingmodel', pricingmodelSchema);
export default pricingmodel;



