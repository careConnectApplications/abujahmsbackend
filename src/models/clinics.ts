import { Schema, model } from "mongoose";

// Define the Clinic Schema
const clinicSchema = new Schema({
    clinic: {
    type: String,
    required: true,
     },
     id: 
     {
        type: String,
        required: true,
    },
    category: {
      type: String,
      enum: [
        "Family Medicine",
        "Paediatrics",
        "Accident & Emergency",
        "Surgery",
        "Obstetrics & Gynaecology",
        "ENT",
        "Ophthalmology",
        "Other"
      ],
      required: true
  },
    type: 
    {
       type: String,
       required: true,
   },
 
},
{ timestamps: true }
);

// Add indexes for performance optimization
clinicSchema.index({ id: 1 }, { unique: true }); // Unique clinic ID
clinicSchema.index({ clinic: 1 }); // Search by clinic name
clinicSchema.index({ category: 1 }); // Filter by category
clinicSchema.index({ type: 1 }); // Filter by type

// Compound indexes for common query patterns
clinicSchema.index({ category: 1, type: 1 }); // Filter by category and type
clinicSchema.index({ clinic: 1, category: 1 }); // Search by name and category

const clinic = model('Clinic', clinicSchema);
export default clinic;
