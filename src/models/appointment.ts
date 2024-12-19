import { Schema, model } from "mongoose";
import configuration from "../config";

export interface appointinterface {
  appointmentid: String;
 
}

const appointmentSchema = new Schema({
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
  appointmentfee: {
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


