import Thearteadmission from "../models/thearteadmission";

import {encrypt} from "../utils/otherservices";
import configuration from "../config";

  //read all patient history
  export async function readallthearteadmission(query:any,selectquery:any,populatequery:any,populatesecondquery:any,populatethirdquery:any) {
    try {
      const thearteadmissiondetails = await Thearteadmission.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).populate(populatethirdquery);
      const totalthearteadmissiondetails = await Thearteadmission.find(query).countDocuments();
      return { thearteadmissiondetails, totalthearteadmissiondetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve theatre admission data");
    }
  };
  export async function createthearteadmission(input:any){
    try{
   
       const thearteadmission = new Thearteadmission(input);
        return await thearteadmission.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create theatre admission");

    }
  }
  //find one
  export async function readonethearteadmission(query:any,selectquery:any,populatequery:any){
    try{
    return await Thearteadmission.findOne(query).select(selectquery).populate(populatequery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve theatre admission data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatethearteadmission(id:any, reqbody:any){
    try{
    const thearteadmission = await Thearteadmission.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!thearteadmission) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return thearteadmission;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update theatre admission");

    }

  }
  //update  appointment by query
  export async function updatethearteadmissionbyquery(query:any, reqbody:any){
    try{
    const thearteadmission = await Thearteadmission.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!thearteadmission) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return thearteadmission;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update theatre admission");

    }

  }
  