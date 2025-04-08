import { Schema, model } from "mongoose";
import configuration from "../config";

export interface labinterface {
  testname: String;
  patient:any,

}
const diagnosis = new Schema({
    diagnosis:String,
    note:String
   
})    
const referrerSchema = new Schema({
    
    referredclinic:String,
    referraldate:Date,
    referredby:String,
    receivingclinic:String,
    preferredconsultant:{
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
    },
    priority:String,
    reasonforreferral:String,
    presentingcomplaints:String,
    presentingcomplaintsnotes:String,
    additionalnotes:String,
    salienthistory:String,
    findingsonexamination:String,
    investigationdoneifany:String,
    laboratoryfindings:String,
    requiredinputintervention:String,
    diagnosis:[
        diagnosis
    ],
    
 
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
 
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

const referrer = model('Referrer', referrerSchema);
export default referrer;



/*
referredorganization
referredunit
referraldate
receivingorganization
receivingunit
preferredconsultant
priority
reasonforreferral
presentingcomplaints
presentingcomplaintsnotes
additionalnotes
salienthistory
findingsonexamination
investigationdoneifany
laboratoryfindings
requiredinputintervention
diagnosis[
diagnosis
note
]
attachmenttype
attachment
*/