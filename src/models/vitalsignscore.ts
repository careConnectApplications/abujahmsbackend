/*
consciousness
ventilation
movement
total
bp
pulserate
respiration
color
temperature
time
*/
import { Schema, model } from "mongoose";

// Define the Clinic Schema
const vitalsignscoreSchema = new Schema({
    consciousness:String,
    ventilation:String,
    movement:String,
    total:String,
    bp:String,
    pulserate:String,
    respiration:String,
    color:String,
    temperature:String,
    time:String,
    postanatheticrecoverychart: 
    {
        type: Schema.Types.ObjectId,
        ref: "Postanatheticrecoverychart",
        default: null,
    },
       
    staffname:{
        type:String
    }
   
 
},
{ timestamps: true }
);
const vitalsignscore = model('Vitalsignscore', vitalsignscoreSchema);
export default vitalsignscore;