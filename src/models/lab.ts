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
<<<<<<< HEAD
const chemicalpathologyreportSchema = new Schema({
=======
const chemicalpathologyreportSchema=new Schema({
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
  testresult: [testresultSchema],
  chemicalpathologyreport: chemicalpathologyreportSchema,
  peripheralbloodfilmreport: peripheralbloodfilmreportSchema,
  ADHbonemarrowaspirationreport: ADHbonemarrowaspirationreportSchema,
=======
  testresult:[testresultSchema ],
  chemicalpathologyreport:chemicalpathologyreportSchema,
  peripheralbloodfilmreport:peripheralbloodfilmreportSchema,
  ADHbonemarrowaspirationreport:ADHbonemarrowaspirationreportSchema,
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
    type: Schema.Types.ObjectId,
    ref: "Payment",
    default: null,
  },
  labcategory: {
=======
      type: Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
  labcategory:{
    required: true,
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    type: String,
    default: "lab",

  },
<<<<<<< HEAD
  sortby: String,
  note: String,
  priority: { type: String, enum: ["urgent", "routine"] },
  sortbydate: Date,
  amount: Number,
  validatedby: String,
  validateddate: Date,
  validationremarks: String,
  hmopercentagecover:Number,
  actualcost:Number,
  chemicalpathologyhemathologyreviewtstatus:{

=======
  sortby:String,
  note: String,
  priority:{type:String, enum: ["urgent", "routine"]},
  sortbydate:Date,
  amount: Number,
  status:{
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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

// Indexes to optimize common queries
labSchema.index({ patient: 1 });                          // Lookup by patient
labSchema.index({ appointment: 1 });                      // Lookup by appointment
labSchema.index({ appointmentid: 1 });                    // Lookup by appointment ID
labSchema.index({ status: 1 });                           // Filter by status
labSchema.index({ testid: 1 });                           // Lookup by test ID
labSchema.index({ sortbydate: 1 });                       // Sort by date
labSchema.index({ createdAt: -1 });                       // Sort by creation time (descending)

// Compound indexes for common query combinations
labSchema.index({ patient: 1, status: 1 });               // Patient's tests by status
labSchema.index({ appointmentid: 1, status: 1 });         // Appointment tests by status
labSchema.index({ status: 1, createdAt: -1 });            // Recent tests by status

const lab = model('Lab', labSchema);
export default lab;
