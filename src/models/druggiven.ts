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
<<<<<<< HEAD

// Single field indexes
druggivenSchema.index({ anathesia: 1 }); // For looking up drugs given for a specific anesthesia
druggivenSchema.index({ timegiven: -1 }); // For sorting by administration time
druggivenSchema.index({ staffname: 1 }); // For staff-based queries
druggivenSchema.index({ createdAt: -1 }); // For sorting by creation date

// Compound indexes for common query patterns
druggivenSchema.index({ anathesia: 1, timegiven: -1 }); // For finding recent drug administrations for a specific anesthesia

const druggiven = model('Druggiven', druggivenSchema);
export default druggiven;
=======
const druggiven = model('Druggiven', druggivenSchema);
export default druggiven;
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
