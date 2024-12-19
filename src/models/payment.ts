import { Schema, model } from "mongoose";
import configuration from "../config";
import bcrypt from "bcryptjs";
export interface paymentinterface {
  paymentype: String;
  patient:any;
  amount:Number
  
}
//create schema
const paymentSchema = new Schema(
  {
    paymentype: {
      required: true,
      type: String,
    },
    amount: {
      type: Number,
      required: true,
     
    },
    
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patientsmanagement",
      default: null,
    },
    status:{
      required: true,
      type: String,
      default: configuration.status[2],
    }
    
  },
  { timestamps: true }
);


//create a model
const payment = model("Payment", paymentSchema);
//export the model
export default payment;
