import { Schema, model } from "mongoose";

// Define the Unit Schema
const unitSchema = new Schema({
    unit: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    clinicId: {
        type: Schema.Types.ObjectId,
        ref: "Clinic",
        default: null,
    },
   
    
},
{ timestamps: true }
);

// Add indexes for performance optimization
unitSchema.index({ id: 1 }, { unique: true }); // Unique unit ID
unitSchema.index({ unit: 1 }); // Search by unit name
unitSchema.index({ clinicId: 1 }); // Lookup by clinic

// Compound indexes for common query patterns
unitSchema.index({ clinicId: 1, unit: 1 }); // Units by clinic and name

const unit = model('Unit', unitSchema);
export default unit;
