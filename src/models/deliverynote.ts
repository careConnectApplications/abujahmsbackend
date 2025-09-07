import { Schema, model } from "mongoose";
import configuration from "../config";
const deliverynoteSchema = new Schema({
   note: String,
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patientsmanagement",
        default: null,
      },
      staffname: String,
},
{ timestamps: true }
);

// Single field indexes
deliverynoteSchema.index({ patient: 1 }); // For looking up delivery notes by patient
deliverynoteSchema.index({ createdAt: -1 }); // For sorting by date
deliverynoteSchema.index({ staffname: 1 }); // For staff-based queries

// Compound indexes for common query patterns
deliverynoteSchema.index({ patient: 1, createdAt: -1 }); // For finding recent delivery notes for a specific patient

const deliverynote= model('Deliverynote', deliverynoteSchema);
export default deliverynote;
