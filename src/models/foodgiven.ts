import { Schema, model } from "mongoose";

// Define the Clinic Schema
const foodgivenSchema = new Schema({
    foodgiven: {
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
    anathesia: 
    {
        type: Schema.Types.ObjectId,
        ref: "Anathesia",
        default: null,
     },
    staffname:{
        type:String
    }
   
 
},
{ timestamps: true }
);
const foodgiven = model('Foodgiven', foodgivenSchema);
export default foodgiven;