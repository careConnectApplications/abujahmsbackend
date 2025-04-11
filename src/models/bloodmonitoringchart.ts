import { Schema, model } from "mongoose";
import configuration from "../config";
const bloodmonitoringSchema = new Schema({
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
      typeoftestRBSFBS:String, 
      value:String,
      staffname: String,
},
{ timestamps: true }
);

const bloodmonitoring= model('Bloodmonitoring', bloodmonitoringSchema);
export default bloodmonitoring;







