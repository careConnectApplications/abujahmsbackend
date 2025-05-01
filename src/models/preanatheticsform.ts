import { Schema, model } from "mongoose";

// Define the Clinic Schema
const preanatheticsSchema = new Schema({
    pastmedicalhistory:String,
    presentmedicalhistory:String,
    anaestheticmedicalhistory:String,
    drugshistory:[],
    dentalhistory:String,
    familyhistory:String,
    physicalexamination:[],
    airwayassessment:String,
    mouth:String,
    neck:String,
    throidmentaldish:String,
    malamphaticscore:String,
    plan:[],
    theatreadmission: {
       type: Schema.Types.ObjectId,
       ref: "Theatreadmission",
       default: null,
     }
 
},
{ timestamps: true }
);
const preanathetics = model('Preanathetics', preanatheticsSchema);
export default preanathetics;
/*

*/
/*
pastmedicalhistory
presentmedicalhistory
anaestheticmedicalhistory
drugshistory
dentalhistory
familyhistory
physicalexamination
airwayassessment
mouth
neck
throidmentaldish
malamphaticscore
plan
*/