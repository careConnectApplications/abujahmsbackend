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

const wardmanagement= model('Wardmanagement', wardmanagementSchema);
export default wardmanagement;



