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
<<<<<<< HEAD
  intaketype: { type: String, trim: true },
  intakeroute: { type: String, trim: true },
  inputamount: { type: Number, default: 0 },
  outputtype: { type: String, trim: true },
  outputroute: { type: String, trim: true },
=======
  inputamount: { type: Number, default: 0 },
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
  observationalNotes: { type: String },
  dateTo: { type: Date, },
  dateFrom: { type: Date }
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
},
  { timestamps: true }
);

<<<<<<< HEAD
// Add indexes for performance optimization
// Single field indexes for primary lookups
fluidbalanceSchema.index({ patient: 1 });
fluidbalanceSchema.index({ admission: 1 });
fluidbalanceSchema.index({ referedward: 1 });
fluidbalanceSchema.index({ createdAt: -1 });
fluidbalanceSchema.index({ dateFrom: 1 });
fluidbalanceSchema.index({ dateTo: 1 });

// Compound indexes for common query patterns
fluidbalanceSchema.index({ patient: 1, createdAt: -1 }); // Patient fluid balance history
fluidbalanceSchema.index({ admission: 1, createdAt: -1 }); // Admission fluid balance history
fluidbalanceSchema.index({ patient: 1, dateFrom: 1, dateTo: 1 }); // Patient records within date range
fluidbalanceSchema.index({ referedward: 1, createdAt: -1 }); // Ward-specific records

=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
const fluidbalance = model('Fluidbalance', fluidbalanceSchema);
export default fluidbalance;
