import Patient from "../models/patientmanagement";
import {patientinterface} from '../models/patientmanagement'
import {encrypt} from "../utils/otherservices";
import configuration from "../config";

  //read all patient history
  export async function readallpatient(query:any,selectquery:any,populatequery:any) {
    try {
      const patientdetails = await Patient.find(query).select(selectquery).populate(populatequery);
      const totalpatientdetails = await Patient.find(query).countDocuments();
      return { patientdetails, totalpatientdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createpatient(input:patientinterface){
    try{
       const user = new Patient(input);
        return await user.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonepatient(query:any,selectquery:any,populatequery:any){
    try{
    return await Patient.findOne(query).select(selectquery).populate(populatequery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  patient by id
  export async function updatepatient(id:any, reqbody:any){
    try{
      if (reqbody.password) {
        const passwordHash = await encrypt(reqbody.password);
        //re-assign hasshed version of original
        reqbody.password = passwordHash;
      }
    const user = await Patient.findOneAndUpdate({ _id: id }, reqbody,{
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

    //update  patient by query
    export async function updatepatientbyanyquery(query:any, reqbody:any){
      try{
        
      const patient = await Patient.findOneAndUpdate(query, reqbody,{
        new: true
      });
        if (!patient) {
          //return json  false response
          throw new Error(configuration.error.errorinvalidcredentials);
        }
        return patient;
      }catch(err){
        console.log(err);
        throw new Error(configuration.error.erroruserupdate);
        
  
      }
  
    }
  