import { Schema, model } from "mongoose";
import configuration from "../config";




const theatreSchema = new Schema({
  
  
  bedspecialization:
  {
    type: String, 
    required: true
  },
  theatrename:
  {
    type: String
  },
  theatreid:
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

const theatre= model('Theatremanagement', theatreSchema);
export default theatre;



