import User from "../models/users";
import bcrypt from "bcryptjs";
import {usersinterface} from '../models/users'
import configuration from "../config";
  //read all payment history
  export async function readall(query:any) {
    try {
      const userdetails = await User.find(query);
      const totaluserdetails = await User.countDocuments();
      return { userdetails, totaluserdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createuser(input:usersinterface){
    try{
       const user = new User(input);
        return await user.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readone(query:any){
    try{
    return await User.findOne(query);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
 
  
  //update mobile users
  export async function updateuser(id:any, reqbody:any){
    try{
      if (reqbody.password) {
        //generate a salt
        const salt = await bcrypt.genSalt(10);
        //generate password hash
    
        const passwordHash = await bcrypt.hash(reqbody.password, salt);
        //re-assign hasshed version of original
        reqbody.password = passwordHash;
      }
    const user = await User.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!user) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return user;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  export async function updateuseranyparam(query:any,update:any){
    try{
      
    return await User.findOneAndUpdate(query, update,{
      new: true
    });
     
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  
  

