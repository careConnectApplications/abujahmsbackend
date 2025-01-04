/*import { Schema, model } from "mongoose";
import configuration from "../config";

export interface vitalinterface {
  patient:any,

}


const vitalSchema = new Schema({
  height:{
    type: String

  },
  weight:
  {
    type: String
  },
  temperature:
  {
    type: String
  },
  heartbit:
  {
    type: String, 
   
  },
  bloodpressuresystolic:
  {
    type: String
  },
  bloodpressurediastolic:
  {
    type: String
  },
  respiration:
  {
    type: String
  },
  saturation:
  {
    type: String
  },
  bmi:
  {
    type: String
  },
  painscore:
  {
    type: String
  },
  rbs:
  {
    type: String
  },
  gcs:
  {
    type: String
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },

  staffname: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
  status:{
    //required: true,
    type: String,
    default: configuration.status[9],

  }
},
{ timestamps: true }
);

const vital = model('Vital', vitalSchema);
export default vital;


*/