import { Schema, model } from "mongoose";
const obstetrichistoryschema = new Schema({
  year: Date,
  sexofchild: String,
  gestage: String,
  birthweight: String,
  problemsduringpregancy: String,
  problemsduringdelivery: String,
  problemsafterdelivery: String,
  placeofbirth: String,
  modeofdelivery: String,
  typeofbirth: String,
  comment: String


})
// Define the Clinic Schema
const anc2Schema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  presentingcomplaints: [],
  historyofpresentingcomplaints: [],
  historyofindexpregnancy: [],
  gynaehistory: [],
  passsurgicalhistory: [],
  drughistory: [],
  familyandsocialhistory: [],
  systematicreview: [],
  reproductiveprofile: {
    bookingstatus: String,
    lmp: Date,
    edd: Date,
    gravidity: String,
    ega: String,
    lcb: String
  },
  pastobstetrichistory: [
    obstetrichistoryschema
  ],
  generalmedicalhistory: {
    diabetesmellitus: Boolean,
    renaldisease: Boolean,
    cardiacdisease: Boolean,
    sicklecelldisease: Boolean,
    hivpositive: Boolean,
    asthma: Boolean,
    epilepsy: Boolean,
    htn: Boolean,
    scd: Boolean,
    dm: Boolean,
    anyotherseveremedicaldeseaseorconditionspecify: String
  },

  ancfollowup: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ancfollowup",
      default: [],
    },
  ],

})

// Add indexes for performance optimization
// Single field indexes
anc2Schema.index({ patient: 1 });
anc2Schema.index({ 'reproductiveprofile.lmp': 1 });
anc2Schema.index({ 'reproductiveprofile.edd': 1 });
anc2Schema.index({ 'reproductiveprofile.bookingstatus': 1 });

// Compound indexes for common query patterns
anc2Schema.index({ patient: 1, 'reproductiveprofile.edd': 1 });
anc2Schema.index({ patient: 1, 'reproductiveprofile.lmp': 1 });

const anc2 = model('Anc2', anc2Schema);
export default anc2;
