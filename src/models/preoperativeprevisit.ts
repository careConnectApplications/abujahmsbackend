import { Schema, model } from "mongoose";

// Define the Clinic Schema
const preoperativeprevisitSchema = new Schema({
    knowledgeofproposedanesthesia:String,
    previousknowledgeofproposedsurgicalintervention:String,
    presentknowledgeofproposedsurgicalintervention:String,
    conscentgained:String,
    assessoftheunknownwrite:String,
    assessthesiteoperation:String,
    skinpreparations:String,
    familyhealthhistory:String,
    vitalsignt:String,
    vitalsignp:String,
    vitalsignr:String,
    vitalsignbp:String,
    generalobservation:String,
    laboratoryinvestigations:String,
    preoperativepreparations:String,
    patientproblem:String,
    nursingdiagnosis:String,
    careinformation:String,
    theatreadmission: {
       type: Schema.Types.ObjectId,
       ref: "Theatreadmission",
       default: null,
     }
 
},
{ timestamps: true }
);
const preoperativeprevisit = model('Preoperativeprevisit', preoperativeprevisitSchema);
export default preoperativeprevisit;
/*

*/