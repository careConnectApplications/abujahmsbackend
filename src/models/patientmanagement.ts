import { Schema, model } from "mongoose";
import configuration from "../config";
import bcrypt from "bcryptjs";
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

patientSchema.pre("save", async function(next){
  try{
      //GENERATE A SALT
      const salt = await bcrypt.genSalt(10);
      //generate password hash
      const passwordHash = await bcrypt.hash(this.password, salt);
      //re-assign hashed version of original
      this.password = passwordHash;
      next();

  }
  catch(error:any){
      next(error)
  }
});


//create a model
const patientsmanagement = model("Patientsmanagement", patientSchema);
//export the model
export default patientsmanagement;
