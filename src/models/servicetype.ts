import { Schema, model } from "mongoose";

// Define the Clinic Schema
const servicetypeSchema = new Schema({
    category: {
    type: String,
    required: true,
     },
     type:[],
     department:{
        type: String,
        required: true,
     },
     id: 
     {
        type: String,
        required: true,
    },
 
},
{ timestamps: true }
);
const servicetype = model('Servicetype', servicetypeSchema);
export default servicetype;