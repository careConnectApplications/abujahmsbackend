import { Schema, model } from "mongoose";

const fluidbalanceSchema = new Schema({
  admission: {
    type: Schema.Types.ObjectId,
    ref: "Admission",
    default: null,
  },
  referedward:
  {
    type: Schema.Types.ObjectId,
    ref: "Wardmanagement",
    default: null,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patientsmanagement",
    default: null,
  },
  inputamount: { type: Number, default: 0 },
  netfliudbalancefor24hours: String,
  staffname: String,
  outputamount: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    default: null,
  },
},
  { timestamps: true }
);

const fluidbalance = model('Fluidbalance', fluidbalanceSchema);
export default fluidbalance;







