import { Schema, model } from "mongoose";
import configuration from "../config";
import bcrypt from "bcryptjs";
export interface paymentinterface {
  paymentype: String;
  patient:any;
  amount:Number,
  paymentreference:String,
  paymentcategory:String,
  
}
//create schema
const paymentSchema = new Schema(
  {
    paymentype: {
      required: true,
      type: String,
    },
    paymentcategory: {
      required: true,
      type: String,
    },
    paymentreference:{
      required: true,
      type: String,

    },
    amount: {
      type: Number,
      required: true,
     
    },
    cashieremail:{
      type: String
    },
    cashierid:{
      type: String
    },
    confirmationdate:{
      type: Date

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
