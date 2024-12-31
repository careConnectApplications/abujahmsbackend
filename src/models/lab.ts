import { Schema, model } from "mongoose";
import configuration from "../config";

export interface labinterface {
  testname: String;
  patient:any,

}
const testresultSchema = new Schema({
  subcomponent: String,
  result: String,
  nranges: String,
  unit: String
});

const labSchema = new Schema({
  processeddate:{
    type: Date

  },
  testname:
  {
    type: String, 
    required: true
  },
  testid:
  {
    type: String, 
    required: true
  },
  department:
  {
    type: String, 
    required: true
  },
  testresult:[testresultSchema ],
  
 
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  appointment: 
    {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      default: [],
    }
  ,
  appointmentid:
  {
    type: String, 
    required: true
  },
  staffname: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
  payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: true,
    },
  
  status:{
    required: true,
    type: String,
    default: configuration.status[2],

  }
});

const lab = model('Lab', labSchema);
export default lab;


