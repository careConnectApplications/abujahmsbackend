import { Schema, model } from "mongoose";
import configuration from "../config";
export interface patientinterface {
  title: String;
  firstName: String;
  middleName: String;
  lastName:String;
}
//create schema
const patientSchema = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    firstName: {
      required: true,
      type: String,
    },
    middleName: {
      type: String,
    },
    lastName: {
      required: true,
      type: String,
    },

    country: {
      required: true,
      type: String,
    },
    stateOfResidence: {
      required: true,
      type: String,
    },
    LGA: {
      required: true,
      type: String,
    },
    address: {
      required: true,
      type: String,
    },
    age: {
      required: true,
      type: String,
    },
    dateOfBirth: {
      required: true,
      type: String,
    },
    gender: {
      required: true,
      type: String,
    },
    nin: {
      type: String,
    },
    phoneNumber: {
      required: true,
      type: String,
    },
    email: {
      type: String,
    },
    oldMRN: {
      type: String,
    },
    nextOfKinName: {
    
      type: String,
    },
    nextOfKinRelatinship: {
    
      type: String,
    },
    nextOfKinPhoneNumber: {
        
        type: String,
      },
      nextOfKinAddress: {
       
        type: String,
      },
    maritalStatus: {
     
      type: String,
    },
    disability: {
      
      type: String,
    },
    occupation: {
    
      type: String,
    },
    isHMOCover: {
      required: true,
      type: String,
    },
    HMOName: {
      type: String,
    },
    HMOId: {
      
      type: String,
    },
    HMOPlan: {
      required: true,
      type: String,
    },
    MRN: {
        required: true,
        type: String,
      },
      password: {
        required: true,
        type: String,
      },
      status:{
        required: true,
        type: String,
        default: configuration.userstatus[1],
  
      }
    
  },
  { timestamps: true }
);


//create a model
const patientsmanagement = model("Patientsmanagement", patientSchema);
//export the model
export default patientsmanagement;
