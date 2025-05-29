import { Schema, model } from "mongoose";

// Define the Clinic Schema
const postanatheticrecoverychartSchema = new Schema({
score: {
    type: String,
    required: true,
     },

timeofdischarge: {
    type: Date,
    required: true,
     },
treatmentgiveninrecoveryroom:[],
commentsbyrecoverynurseorwardnurse:[],
commentsbyanaesthetist:[],
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
const postanatheticrecoverychart = model('Postanatheticrecoverychart', postanatheticrecoverychartSchema);
export default postanatheticrecoverychart;