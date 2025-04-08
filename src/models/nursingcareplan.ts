


import { Schema, model } from "mongoose";
import configuration from "../config";
const nursingcareplanSchema = new Schema({
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
nursingdiagnosis: [],
objectives: String,
actionintervention:String,
evaluation:String,
staffname:String
},
{ timestamps: true }
);

const nursingcareplan= model('Nursingcareplan',nursingcareplanSchema );
export default nursingcareplan;




/*

[nursingdiagnosis: String,
objectives: String,
action/intervention:String
evaluation:String]

*/