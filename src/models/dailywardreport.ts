import { Schema, model } from "mongoose";
import configuration from "../config";
const dailywardreportSchema = new Schema({

ward:
  {
    type: Schema.Types.ObjectId,
    ref: "Wardmanagement",
    default: null,
  },
   wardreport:[], 
   staffname: String,
},
{ timestamps: true }
);

// Single field indexes
dailywardreportSchema.index({ ward: 1 }); // For looking up reports by ward
dailywardreportSchema.index({ createdAt: -1 }); // For sorting by date
dailywardreportSchema.index({ staffname: 1 }); // For staff-based queries

// Compound indexes for common query patterns
dailywardreportSchema.index({ ward: 1, createdAt: -1 }); // For finding recent reports for a specific ward

const dailywardreport= model('Dailywordreport', dailywardreportSchema);
export default dailywardreport;
