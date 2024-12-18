import { Schema, model } from "mongoose";
import configuration from "../config";

export interface appointinterface {
  appointmentid: String;
 
}


const appointmentSchema = new Schema({
  /*
  date: {
    type: Date,
    required: true
  },
  */
  patientName: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  // other fields...
});

const Appointment = model('appointment', appointmentSchema);
export default Appointment;


