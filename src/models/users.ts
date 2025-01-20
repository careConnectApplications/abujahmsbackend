import { Schema, model } from "mongoose";
import configuration from "../config";
import bcrypt from "bcryptjs";
export interface usersinterface {
  title: String;
  firstName: String;
  middleName: String;
  lastName:String;
}
//create schema
const userSchema = new Schema(
  {
    title: {
      
      type: String
    },
    staffId: {
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
     
      type: String
    },
    state: {
      
      type: String
    },
    city: {
     
      type: String
    },
    address: {
    
      type: String
    },
    age: {
    
      type: String
    },
    dateOfBirth: {
     
      type: String
    },
    gender: {
      required: true,
      type: String,
    },
    licence: {
   
      type: String
    },
    phoneNumber: {
    
      type: String
    },
    email: {
      required: true,
      type: String,
    },
    role: {
      required: true,
      type: String,
    },
    degree: {
     
      type: String
    },
    profession: {
    
      type: String
    },
    employmentStatus: {
   
      type: String
    },
    nativeSpokenLanguage: {
      
      type: String
    },
    otherLanguage: {
     
      type: String
    },
    readWriteLanguage: {
      
      type: String
    },
    clinic: {
      required: true,
      type: String,
    },
    zip: {
    
      type: String
    },
    specializationDetails: {
    
      type: String
    },
    password: {
      required: [true, "Password is required"],
      type: String,
    },
    status:{
      required: true,
      type: String,
      default: configuration.status[1],

    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next){
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
const users = model("Users", userSchema);
//export the model
export default users;
