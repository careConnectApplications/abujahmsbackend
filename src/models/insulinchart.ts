import { Schema, model } from "mongoose";
import configuration from "../config";
const insulinSchema = new Schema({
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
      dateandtimeofbloodglucosemonitoring:Date,
      premealbloodglucoselevel:String,
      postmealbloodglucoselevel:String,
      fastingbloodglucose:String,
      dateandtimeofinsulinadministration:Date,
      timeofinsulinadministration:String,
      typeofinsulin:String,
      dosage:String,
      route:String,
      rbsvalue:String,
      mealtimes:String,
      carbonhydrateintakeestimation:String,
      symtoms:String,
      interventionprovided:String,
     staffname: String,
},
{ timestamps: true }
);

const insulin= model('Insulin', insulinSchema);
export default insulin;



