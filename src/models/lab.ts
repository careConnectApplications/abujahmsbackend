import { Schema, model } from "mongoose";
import configuration from "../config";

export interface labinterface {
  testname: String;
  patient: any,

}
const testresultSchema = new Schema({
  subcomponent: String,
  result: String,
  nranges: String,
  unit: String
});
const chemicalpathologyreportSchema = new Schema({
  comment: String,
  reportedby: { type: String },
  status: String
});
const peripheralbloodfilmreportSchema = new Schema({
  summary: [{ type: String }],
  redbloodcell: [{ type: String }],
  whitebloodcell: [{ type: String }],
  platelet: [{ type: String }],
  impression: [{ type: String }],
  suggestion: [{ type: String }],
  reportedby: { type: String },
  status: String
});
const ADHbonemarrowaspirationreportSchema = new Schema({
  clinicalnotes: [{ type: String }],
  boneconsistency: { type: String },
  aspiration: { type: String },
  erythroidratio: { type: String },
  erythropoiesis: [{ type: String }],
  leucopoesis: [{ type: String }],
  megakaryopoiesis: [{ type: String }],
  plasmacells: [{ type: String }],
  abnomalcells: { type: String },
  ironstore: { type: String },
  conclusion: [{ type: String }], // assuming this was a typo for "conclusion"
  reportedby: { type: String },
  status: String
});




const labSchema = new Schema({
  processeddate: {
    type: Date

  },
  testname:
  {
    type: String,
    required: true
  },
  testid:
  {
    type: String,
    required: true
  },
  department:
  {
    type: String,
    required: true
  },
  testresult: [testresultSchema],
  chemicalpathologyreport: chemicalpathologyreportSchema,
  peripheralbloodfilmreport: peripheralbloodfilmreportSchema,
  ADHbonemarrowaspirationreport: ADHbonemarrowaspirationreportSchema,
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  appointment:
  {
    type: Schema.Types.ObjectId,
    ref: "Appointment",
    default: null,
  }
  ,
  remark:
  {
    type: String
  },
  appointmentid:
  {
    type: String,
    required: true
  },
  staffname: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
  raiseby: String,
  payment: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    default: null,
  },
  labcategory: {
    required: true,
    type: String,
    default: "lab",

  },
  sortby: String,
  note: String,
  priority: { type: String, enum: ["urgent", "routine"] },
  sortbydate: Date,
  amount: Number,
  hmopercentagecover:Number,
  actualcost:Number,
  chemicalpathologyhemathologyreviewtstatus:{

    required: true,
    type: String,
    default: configuration.status[14],

  },
  status: {
    required: true,
    type: String,
    default: configuration.status[14],

  },
  filename: {
    type: String,
    trim: true,
  },
},
  { timestamps: true }
);

const lab = model('Lab', labSchema);
export default lab;
