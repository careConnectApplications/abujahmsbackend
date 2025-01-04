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
const assessmentSchema = new Schema({
  assessmentdiagnosis: String

})

const vitalsSchema = new Schema({
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
staffname: String,
status:{
 
  type: String,
  default:configuration.status[9]


}
});


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
    encounter:{ 
      vitals: vitalsSchema,
      assessmentdiagnosis: assessmentSchema
    },
    lab: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lab",
        default: [],
      },
    ],
  
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

const appointment = model('Appointment', appointmentSchema);
export default appointment;


