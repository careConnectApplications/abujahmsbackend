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
},
{ timestamps: true }
);

const hmomanagement= model('Hmomanagement', hmomanagementSchema);
export default hmomanagement;



