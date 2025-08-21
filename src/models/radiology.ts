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

const radiology = model('Radiology', radiologySchema);
export default radiology;


