import { Schema, model } from "mongoose";

// Define the Clinic Schema
const clinicSchema = new Schema({
    clinic: {
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
const clinic = model('Clinic', clinicSchema);
export default clinic;