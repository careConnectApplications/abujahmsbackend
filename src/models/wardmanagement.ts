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
  beds: [
    {
      bednumber: { type: String, required: true },
      status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
      assignedPatient: { type: Schema.Types.ObjectId, ref: 'Patient', default: null },
      assignedDate: { type: Date }
    }
  ],
  status:{
    type: String,
    default: configuration.status[1],
    required: true

  }
},
{ timestamps: true }
);

const wardmanagement= model('Wardmanagement', wardmanagementSchema);
export default wardmanagement;



