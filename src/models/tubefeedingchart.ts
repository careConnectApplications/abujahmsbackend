import { Schema, model } from "mongoose";
import configuration from "../config";
const feedingtubechartSchema = new Schema({
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
      Datetimefeeds:Date, 
      amount:String,
      sign:String,
        staffname: String,
},
{ timestamps: true }
);

const feedingtubechart= model('Feedingtubechart', feedingtubechartSchema);
export default feedingtubechart;



