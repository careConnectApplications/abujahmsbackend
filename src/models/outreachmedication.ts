import { Schema, model } from "mongoose";
import configuration from "../config";




const outreachMedicationSchema = new Schema({
  outreachmedicationname:
  {
    type: String, 
    required: true
  },
  outreachmedicationid:{
    type: String, 
    required: true
  },
  status:{
    type: String,
    default: configuration.status[1],
    required: true

  }
},
{ timestamps: true }
);

const outreachMedications= model('OutreachMedication', outreachMedicationSchema);
export default outreachMedications;



