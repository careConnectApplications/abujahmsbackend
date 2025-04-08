import { Schema, model } from "mongoose";
import configuration from "../config";
const fluidbalanceSchema = new Schema({
    admission: {
        type: Schema.Types.ObjectId,
        ref: "Admission",
        default: null,
      },
      referedward:
  {
    type: Schema.Types.ObjectId,
    ref: "Wardmanagement",
    default: null,
  },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
      },
oralfluids:String,
tubefeedingvolume:String,
IVfluidtype:String,
IVfluidvolume:String,
IVfluidrate:String,
medication:String,
urineoutput:String,
stoolfrequency:String,
consistency:String,
stoolamount:String,
vomitamount:String,
drainage:String,
totalintake:String,
totaloutput:String,
netfliudbalancefor24hours:String,
staffname: String,
},
{ timestamps: true }
);

const fluidbalance= model('Fluidbalance', fluidbalanceSchema);
export default fluidbalance;







