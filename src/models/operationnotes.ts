import { Schema, model } from "mongoose";

// Define the Clinic Schema
const preoperationnoteSchema = new Schema({
    diagnosispreop:String,
    diagnosisoperative:String,
    operative:String,
    surgeon:String,
    assistants:[],
    preoperativenurse:String,
    anestheticnurse:String,
    typeofanesthetic:String,
    findings:[],
    theatreadmission: {
       type: Schema.Types.ObjectId,
       ref: "Theatreadmission",
       default: null,
     }
 
},
{ timestamps: true }
);
const preoperationnote = model('Preoperationnote', preoperationnoteSchema);
export default preoperationnote;
/*

*/
/*
diagnosis
operative
surgeon
assistants
preoperativenurse
anestheticnurse
typeofanesthetic
findings:[]
*/