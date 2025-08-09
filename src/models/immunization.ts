
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

const immunization= model('Immunization', immunizationSchema);
export default immunization;





