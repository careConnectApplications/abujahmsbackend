import { Schema, model } from "mongoose";

// Define the Clinic Schema
const druggivenSchema = new Schema({
    druggiven: {
    type: String,
    required: true,
     },
   
     timegiven: 
     {
        type: Date,
        required: true,
    },
    bp:{
        type: String,
        required: true,
    },
    pulse:{
        type: String,
        required: true,
    },
      temp:{
        type: String,
        required: true,
    },
   
 
},
{ timestamps: true }
);
const druggiven = model('Druggiven', druggivenSchema);
export default druggiven;