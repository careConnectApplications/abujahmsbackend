import { Schema, model } from "mongoose";
import configuration from "../config";

export interface appointinterface {
  appointmentid: String;
  patient:any,
  clinic:String,
  reason:String,
  appointmentdate:any,
  appointmentcategory:String,
  appointmenttype:String
 
}

const appointmentSchema = new Schema({
  appointmentid:
  {
    type: String, 
    required: true
  },
  reason: String,
  findings: String,  // Description of the examination findings
  diagnosis: String, // Doctor's diagnosis based on the examination
  prescriptions: String,  // List of prescribed medications or treatments
  requestforlabtest: String,
  notes: String, // Additional notes (if any)
  appointmentdate:
  {
    type: Date, 
    required: true
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
  payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: true,
    },
  
  appointmentcategory: {
    type: String,
    required: true
  },
  appointmenttype: {
    type: String,
    required: true
  },
  clinic: {
    type: String,
    required: true
  },
  status:{
    required: true,
    type: String,
    default: configuration.status[2],

  }
});

const Appointment = model('appointment', appointmentSchema);
export default Appointment;


