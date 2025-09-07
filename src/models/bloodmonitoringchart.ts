import { Schema, model } from "mongoose";
import configuration from "../config";
const bloodmonitoringSchema = new Schema({
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
      typeoftestRBSFBS:String, 
      value:String,
      staffname: String,
      datetime:Date
},
{ timestamps: true }
);

// Add indexes for performance optimization
bloodmonitoringSchema.index({ patient: 1 }); // Lookup by patient
bloodmonitoringSchema.index({ admission: 1 }); // Lookup by admission
bloodmonitoringSchema.index({ referedward: 1 }); // Lookup by ward
bloodmonitoringSchema.index({ datetime: -1 }); // Sort by date
bloodmonitoringSchema.index({ typeoftestRBSFBS: 1 }); // Filter by test type

// Compound indexes for common query patterns
bloodmonitoringSchema.index({ patient: 1, datetime: -1 }); // Patient blood monitoring by date
bloodmonitoringSchema.index({ admission: 1, datetime: -1 }); // Admission blood monitoring by date
bloodmonitoringSchema.index({ patient: 1, typeoftestRBSFBS: 1, datetime: -1 }); // Patient tests by type and date

const bloodmonitoring= model('Bloodmonitoring', bloodmonitoringSchema);
export default bloodmonitoring;
