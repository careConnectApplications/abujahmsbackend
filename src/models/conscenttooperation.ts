import { Schema, model } from "mongoose";

// Define the Clinic Schema
const conscenttooperationSchema = new Schema({
    nameofexplainer: {
    type: String,
    required: true,
     },
     filename:String,
     nameofrepresentive: 
     {
        type: String,
        required: true,
    },
   conscentdate: Date,
   theatreadmission: {
       type: Schema.Types.ObjectId,
       ref: "Theatreadmission",
       default: null,
     },
 
},
{ timestamps: true }
);
const conscenttooperation = model('Conscenttooperation', conscenttooperationSchema);
export default conscenttooperation;