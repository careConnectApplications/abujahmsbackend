import { Schema, model } from "mongoose";
import configuration from "../config";

export interface labinterface {
  testname: String;
  patient: any,

}
const radiologySchema = new Schema({
  processeddate: {
    type: Date

  },
  note:
  {
    type: String
  },
  remark:
  {
    type: String
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
    type: String
    //required: true
  },
  testresult: [],
  typetestresult: [],
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  raiseby: {
    type: String,

  },
  amount: Number,
  hmopercentagecover:Number,
  actualcost:Number,
  processby: {
    type: String
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
    default: null,
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

// Add indexes for performance optimization
// Single field indexes
radiologySchema.index({ patient: 1 });
radiologySchema.index({ status: 1 });
radiologySchema.index({ testid: 1 });
radiologySchema.index({ createdAt: -1 });
radiologySchema.index({ payment: 1 });
radiologySchema.index({ processeddate: 1 });

// Compound indexes for common query patterns
radiologySchema.index({ patient: 1, status: 1 });
radiologySchema.index({ status: 1, createdAt: -1 });
radiologySchema.index({ testid: 1, status: 1 });

const radiology = model('Radiology', radiologySchema);
export default radiology;
