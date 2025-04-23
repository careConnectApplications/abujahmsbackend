import { Schema, model } from "mongoose";
import configuration from "../config";
const dailywardreportSchema = new Schema({

ward:
  {
    type: Schema.Types.ObjectId,
    ref: "Wardmanagement",
    default: null,
  },
   wardreport:[], 
   staffname: String,
},
{ timestamps: true }
);

const dailywardreport= model('Dailywordreport', dailywardreportSchema);
export default dailywardreport;



