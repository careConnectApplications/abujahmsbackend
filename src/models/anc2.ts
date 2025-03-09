import { Schema, model } from "mongoose";
const obstetrichistoryschema = new Schema({
    year:Date,
    sexofchild:String,
    gestage:String,
    birthweight:String,
    lengthoflabour:String,
    placeoflabour:String,
    modeofdelivery:String,
    comment:String


})
// Define the Clinic Schema
const anc2Schema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
        },
presentingcomplaints:[],
historyofpresentingcomplaints:[],
historyofindexpregnancy:[],
gynaehistory:[],
passsurgicalhistory:[],
drughistory:[],
familyandsocialhistory:[],
systematicreview:[],
reproductiveprofile:{
bookingstatus:String,
lmp:Date,
edd:Date,
gravidity:String,
ega:String,
lcb:String
},
pastobstetrichistory:[
    obstetrichistoryschema
],
generalmedicalhistory:{
diabetesmellitus:Boolean,
renaldisease:Boolean,
cardiacdisease:Boolean,
sicklecelldisease:Boolean,
hivpositive:Boolean,
asthma:Boolean,
epilepsy:Boolean,
htn:Boolean,
scd:Boolean,
dm:Boolean,
anyotherseveremedicaldeseaseorconditionspecify:String
},

ancfollowup: [
  {
    type: Schema.Types.ObjectId,
    ref: "Ancfollowup",
    default: [],
  },
],

})

const anc2 = model('Anc2', anc2Schema);
export default anc2;
