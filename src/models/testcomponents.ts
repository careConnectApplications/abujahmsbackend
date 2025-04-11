import { Schema, model } from "mongoose";

// Define the Clinic Schema
const testcomponentSchema = new Schema({
    testname: {
    type: String,
    required: true,
     },
     subcomponients:[],
     
 
},
{ timestamps: true }
);
const testcomponent = model('Testcomponent', testcomponentSchema);
export default testcomponent;