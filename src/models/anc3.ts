import { Schema, model } from "mongoose";
const previouspregnancyschema = new Schema({
year:String,
durationpregnancy:String,
antenatalcomplication:String,
labour:String,
ageifalive:String,
ageifdead:String,
causeofdeath:String

})
// Define the Clinic Schema
const anc3Schema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
        },
postmedicalorsurgicalhistory:[],
pregnancysummary:{
lmp:Date,
edd:Date,
gravidity:String
},

previouspregnancy:[
    previouspregnancyschema
],
historyofpresentpregnancy:[],
generalexamination:{
breasts:String,
height:String,
cvs:String,
rs:String,
pelvis:String,
abdomen:String

},

ancfollowup: [
  {
    type: Schema.Types.ObjectId,
    ref: "Ancfollowup3",
    default: [],
  },
],

})

const anc3 = model('Anc3', anc3Schema);
export default anc3;
