import { Schema, model } from "mongoose";
import configuration from "../config";




const hmomanagementSchema = new Schema({
  hmoname:
  {
    type: String
  },
  id:
  {
    type: String,
    required: true,
  },
  insuranceId: {
    type: String, trim: true
  }
},
  { timestamps: true }
);

<<<<<<< HEAD
// Add indexes for performance optimization
hmomanagementSchema.index({ id: 1 }, { unique: true }); // Unique HMO ID
hmomanagementSchema.index({ hmoname: 1 }); // Search by HMO name
hmomanagementSchema.index({ insuranceId: 1 }); // Search by insurance ID

// Compound indexes for common query patterns
hmomanagementSchema.index({ hmoname: 1, insuranceId: 1 }); // Search by name and insurance ID

=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
const hmomanagement = model('Hmomanagement', hmomanagementSchema);
export default hmomanagement;
