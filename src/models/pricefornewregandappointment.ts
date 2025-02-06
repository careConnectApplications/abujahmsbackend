import { Schema, model } from "mongoose";
import configuration from "../config";

export interface priceinterface {
  servicecategory: String,
  amount:  Number,
  servicetype: String,
  
 
}


const priceappointmentnewregistrationSchema = new Schema({

  servicecategory: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  servicetype: {
    type: String,
    required: true
  },
  category:
  {
    type: String
  },
  pharmacy:
  {
    type: String
  },
  
  qty:
  {
    type: Number
  },
  lowstocklevel: {
    type: Number
  
  },
  expirationdate: {
      type: Date
    },
 lastrestockdate: {
        type: Date
      },
  status:{
    required: true,
    type: String,
    default: configuration.status[1],

  }
});

const price = model('Price', priceappointmentnewregistrationSchema);
export default price;


