
import { Schema, model } from "mongoose";
import configuration from "../config";
const immunizationSchema = new Schema({
   
patient: {
type: Schema.Types.ObjectId,
ref: "Patientsmanagement",
default: null,
},
anynotedadverseeffect:{
type: String,
default: configuration.anynotedadverseeffect[1],
},
adverseeffectseverity:String,
medicationgiventomanageadverseeffect:String,
//
vaccination:{
 type: [String], // Array of vaccinations
},
vaccinationlocation: {
  type: String,
  enum: ['fixed', 'outreach'],
  required: true
},
outreachMedications: {
  type: [String], // Array of medication names or IDs from dropdown
  default: []
},
isFullyImmunized: {
  type: Boolean,
  required: true,
  default: false
},
adverseEffectVaccine:String,
isZeroDoseChild: {
  type: Boolean,
  required: true,
  default: false
},
//
schedule:String,
vaccinecode:String,
vaccinename:String,
vaccinetype:String,
manufacturer:String,
batchno:String,
expirydate:Date,
dose:String,
doseamount:String,
administrationsite:String,
administrationroute:String,
consent:String,
immunizationstatus:String,
comment:String,
onsetdateofreaction:Date,
reactcode:String,
reporter:String,
reportingsource:String,
staffname:String
},
{ timestamps: true }
);

// Add indexes for performance optimization
// Single field indexes for primary lookups
immunizationSchema.index({ patient: 1 });
immunizationSchema.index({ immunizationstatus: 1 });
immunizationSchema.index({ vaccinationlocation: 1 });
immunizationSchema.index({ isFullyImmunized: 1 });
immunizationSchema.index({ isZeroDoseChild: 1 });
immunizationSchema.index({ createdAt: -1 });
immunizationSchema.index({ expirydate: 1 });
immunizationSchema.index({ batchno: 1 });

// Compound indexes for common query patterns
immunizationSchema.index({ patient: 1, createdAt: -1 }); // Patient immunization history
immunizationSchema.index({ patient: 1, isFullyImmunized: 1 }); // Patient immunization status
immunizationSchema.index({ vaccinationlocation: 1, createdAt: -1 }); // Location-based records
immunizationSchema.index({ isZeroDoseChild: 1, createdAt: -1 }); // Zero dose children tracking

const immunization= model('Immunization', immunizationSchema);
export default immunization;
