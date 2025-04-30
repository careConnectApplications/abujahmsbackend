import { Schema, model } from "mongoose";
import configuration from "../config";




const theatreadmissionSchema = new Schema({
  
  procedures:[{
    type: Schema.Types.ObjectId,
          ref: "Procedure",
          default: [],
  }],
  theatreadmissionid:String,
  referedtheatre:
  {
    type: Schema.Types.ObjectId,
    ref: "Theatremanagement",
    default: null,
  },
  conscent:
  {
    type: Schema.Types.ObjectId,
    ref: "Conscenttooperation",
    default: null,
  },
  preoperativeprevisit:
  {
    type: Schema.Types.ObjectId,
    ref: "Preoperativeprevisit",
    default: null,
  },
  previoustheatre:
  {
    type: Schema.Types.ObjectId,
    ref: "Theatremanagement",
    default: null,
  },
  clinic:
  {
    type: String
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  appointmentdate: Date,
  doctorname:
  {
    type: String, 
    required: true
  },
  staffname:
  {
    type: String
  }, 
  status:{
    type: String,
    default: configuration.admissionstatus[0],
    required: true

  }
},
{ timestamps: true }
);

const theatreadmission= model('Theatreadmission', theatreadmissionSchema);
export default theatreadmission;



