import { Schema, model } from "mongoose";

const previouspregnancyschema = new Schema({
  year: String,
  durationPregnancy: String,
  antenatalComplication: String,
  labour: String,
  puerperium: { type: String, trim: true },
  ageifdead: String,
  causeofdeath: String,
  birthWeight: { type: String, trim: true },
  sex: { type: String, trim: true },
});

// Define the Clinic Schema
const anc3Schema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  postmedicalorsurgicalhistory: [],
  bookingInformation: {
    bookingDate: { type: Date },
    lmp: { type: Date },
    edd: { type: Date },
    expectedGestationalAge: { type: String, trim: true },
    gravida: { type: String, trim: true },
    indication: { type: String, trim: true },
    specialPoint: { type: String, trim: true },
    consultant: { type: String, trim: true },
    ega: { type: String, trim: true }
  },
  previouspregnancy: [
    previouspregnancyschema
  ],
  historyofpresentpregnancy: [],
  presentPregnancy: {
    bleeding: { type: String, trim: true },
    discharge: { type: String, trim: true },
    swellingAnkles: { type: String, trim: true },
    urinarySymptoms: { type: String, trim: true },
  },
  generalexamination: {
    cycle: { type: String, trim: true },
    breasts: { type: String, trim: true },
    height: { type: String, trim: true },
    weight: { type: String, trim: true },
    cvs: { type: String, trim: true },
    rs: { type: String, trim: true },
    pelvis: { type: String, trim: true },
    abdomen: { type: String, trim: true },
    retroviral: { type: String, trim: true },
    bp: { type: String, trim: true },
    urine: { type: String, trim: true },
    hb: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    groupRh: { type: String, trim: true },
    genotype: { type: String, trim: true },
    VDRL: { type: String, trim: true },
    others: { type: String, trim: true },
    comments: { type: String, trim: true },
  },
  staffName: { type: String, trim: true },
  staffInfo: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
  ancfollowup: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ancfollowup3",
      default: [],
    },
  ],

}, { timestamps: true })

const anc3 = model('Anc3', anc3Schema);
export default anc3;
