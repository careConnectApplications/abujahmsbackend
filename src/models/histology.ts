import { Schema, model } from "mongoose";

// Define the Clinic Schema
const histologyrequestSchema = new Schema({
    africannonafrican:[],
    historyofpresentillness:[],
    presentingcomplaint:[],
    findingonphysicalexamination:[],
    otherfindings:[],
    anatomicalsiteofbiopsy:[],
    grossappearanceoflesion:[],
    previousreportwithnumberanddate:[],
    nameofconsultant:String,
    theatreadmission: {
       type: Schema.Types.ObjectId,
       ref: "Theatreadmission",
       default: null,
     }
 
},
{ timestamps: true }
);
const histologyrequest = model('Histologyrequest', histologyrequestSchema);
export default histologyrequest;