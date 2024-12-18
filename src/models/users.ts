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
      required: true,
      type: String,
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
      required: true,
      type: String,
    },
    state: {
      required: true,
      type: String,
    },
    city: {
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
    licence: {
      required: true,
      type: String,
    },
    phoneNumber: {
      required: true,
      type: String,
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
      required: true,
      type: String,
    },
    profession: {
      required: true,
      type: String,
    },
    employmentStatus: {
      required: true,
      type: String,
    },
    nativeSpokenLanguage: {
      required: true,
      type: String,
    },
    otherLanguage: {
      required: true,
      type: String,
    },
    readWriteLanguage: {
      required: true,
      type: String,
    },
    clinic: {
      required: true,
      type: String,
    },
    zip: {
      required: true,
      type: String,
    },
    specializationDetails: {
      required: true,
      type: String,
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
