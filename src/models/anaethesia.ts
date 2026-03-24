
import { Schema, model } from "mongoose";

// Define the Clinic Schema
const anathesiaSchema = new Schema({
preopeassessment: {
    type: String,
    required: true,
     },
allergies: {
    type: String,
    required: true,
     }, 
weight: {
    type: String,
    required: true,
     },
asa: {
    type: String,
    required: true,
     },
temp: {
    type: String,
    required: true,
     },
premedication: {
    type: String,
    required: true,
     },
timegivenpremedication: {
    type: Date,
    required: true,
     },
timeoflastfood: {
    type: Date,
    required: true,
     },
vlinesite: {
    type: String,
    required: true,
     },
cannulasize: {
    type: String,
    required: true,
     },
druggiven: [ {
                type: Schema.Types.ObjectId,
                ref: "Druggiven",
                default: null,
            }],
fluidsfoodgiven: [ {
                type: Schema.Types.ObjectId,
                ref: "Foodgiven",
                default: null,
            }],

technique:[],
bloodloss: {
    type: String,
    required: true,
     },
totalinput: {
    type: String,
    required: true,
     },
postofinstruction:[],
filledby: {
    type: String,
    required: true,
     },
   theatreadmission: {
       type: Schema.Types.ObjectId,
       ref: "Theatreadmission",
       default: null,
     },
 
},
{ timestamps: true }
);
<<<<<<< HEAD

// Add indexes for performance optimization
// Single field indexes
anathesiaSchema.index({ theatreadmission: 1 });
anathesiaSchema.index({ createdAt: -1 });
anathesiaSchema.index({ filledby: 1 });
anathesiaSchema.index({ asa: 1 });

// Compound indexes for common query patterns
anathesiaSchema.index({ theatreadmission: 1, createdAt: -1 });
anathesiaSchema.index({ filledby: 1, createdAt: -1 });

const anathesia = model('Anathesia', anathesiaSchema);
export default anathesia;
=======
const anathesia = model('Anathesia', anathesiaSchema);
export default anathesia;
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
