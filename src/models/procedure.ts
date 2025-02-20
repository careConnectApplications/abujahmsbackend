import { Schema, model } from "mongoose";
import configuration from "../config";

export interface labinterface {
  testname: String;
  patient:any,

}
const procedureSchema = new Schema({
    clinic:String,
    indicationdiagnosisprocedure:String,
    procedure:[],
    appointmentdate:String,
    cptcodes:[],
    dxcodes:[],
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  raiseby: {
    type: String,
   
  },
  processby: {
    type: String
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
},
{ timestamps: true }
);

const procedure = model('Procedure', procedureSchema);
export default procedure;



/*

clinic
indicationdiagnosisprocedure
procedure:[]
appointmentdate
cptcodes:[]
dxcodes:[]

*/