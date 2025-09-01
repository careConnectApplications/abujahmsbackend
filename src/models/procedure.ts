import { Schema, model } from "mongoose";
import configuration from "../config";

export interface labinterface {
  testname: String;
  patient:any,

}
const procedureSchema = new Schema({
    clinic:String,
    procedureid:
  {
    type: String, 
    required: true
  },
  procedureoutcome:String,
    indicationdiagnosisprocedure:String,
    procedure: String,
    appointmentdate:String,
    cptcodes:[],
    dxcodes:[],
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  procedureresult:[],
  raiseby: {
    type: String,
   
  },
  processby: {
    type: String
  },
  proceduretype: {
      type: String,
      enum: [
        "Major Operation",
        "Intermediate Operation",
        "Minor Operation",
        "Circumcision",
      ],
      required: true,
    },
  amount:Number,
  hmopercentagecover:Number,
  actualcost:Number,
  payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
  
  status:{
    required: true,
    type: String,
    default: configuration.status[9],

  }
},
{ timestamps: true }
);

const procedure = model('Procedure', procedureSchema);
export default procedure;



