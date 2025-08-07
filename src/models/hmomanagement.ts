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
  hmopercentagecover: {
    type: Number,
    min: 0,
    max: 100,
    default: 0 // Optional: default coverage percentage
  }
},
{ timestamps: true }
);

const hmomanagement= model('Hmomanagement', hmomanagementSchema);
export default hmomanagement;



