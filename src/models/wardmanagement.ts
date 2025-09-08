import { Schema, model } from "mongoose";
import configuration from "../config";




const wardmanagementSchema = new Schema({
  
  
  bedspecialization:
  {
    type: String, 
    required: true
  },
  wardname:
  {
    type: String
  },
  wardid:
  {
    type: String
  },
  totalbed:
  {
    type: Number, 
    required: true
  },
  occupiedbed:
  {
    type: Number, 
    required: true
  },
  vacantbed:
  {
    type: Number,
    required: true
  }, 

  status:{
    type: String,
    default: configuration.status[1],
    required: true

  }
},
{ timestamps: true }
);

// Add indexes for performance optimization
// Single field indexes for primary lookups
wardmanagementSchema.index({ wardname: 1 });
wardmanagementSchema.index({ wardid: 1 });
wardmanagementSchema.index({ bedspecialization: 1 });
wardmanagementSchema.index({ status: 1 });
wardmanagementSchema.index({ vacantbed: 1 });

// Compound indexes for common query patterns
wardmanagementSchema.index({ status: 1, vacantbed: -1 }); // Active wards with available beds
wardmanagementSchema.index({ bedspecialization: 1, status: 1 }); // Wards by specialization
wardmanagementSchema.index({ wardname: 1, status: 1 }); // Ward lookup by name and status

const wardmanagement= model('Wardmanagement', wardmanagementSchema);
export default wardmanagement;
