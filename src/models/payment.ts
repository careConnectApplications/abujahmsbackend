import { Schema, model } from "mongoose";
import configuration from "../config";
import bcrypt from "bcryptjs";
export interface paymentinterface {
  paymentype: String;
  patient:any;
  amount:Number,
  qty:Number,
  paymentreference:String,
  paymentcategory:String,
  
}
//create schema
const paymentSchema = new Schema(
  {
    firstName:String,
    lastName:String,
    MRN:String,
    HMOId:String,
    phoneNumber:String,
<<<<<<< HEAD
    department: String,
    billingtype: {
        type: String,
        enum: ["non-custom-billing", "custom-billing"], // add all valid options
        default: "non-custom-billing"
    },

=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
    qty: {
      type: Number,
      default: 1,
     
    },
    numberoftimesprinted: {
      type: Number,
      default: 0,
     
    },
    cashieremail:{
      type: String
    },
    cashiername:{
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
paymentSchema.index({ status: 1, paymentreference: 1, createdAt: -1 })
paymentSchema.index({ paymentreference: 1 })
paymentSchema.index({ status: 1 });
paymentSchema.index({ patient: 1 });


//create a model
const payment = model("Payment", paymentSchema);
//export the model
export default payment;
