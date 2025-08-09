import Admission from "../models/admission";

import {encrypt} from "../utils/otherservices";
import configuration from "../config";


export async function countadmission(query:any) {
  try {
    
    return await Admission.countDocuments(query);
   
  } catch (err) {
    console.log(err);
    throw new Error(configuration.error.erroruserread);
  }
};
  //read all patient history
  export async function readalladmission(query:any,selectquery:any,populatequery:any,populatesecondquery:any,populatethirdquery:any) {
    try {
      const admissiondetails = await Admission.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).populate(populatethirdquery);
      const totaladmissiondetails = await Admission.find(query).countDocuments();
      return { admissiondetails, totaladmissiondetails };
    } catch (err) {
      console.log(err);
      throw new Error(`${configuration.error.errorgeneral} reading admission`);
    }
  };
  export async function createadmission(input:any){
    try{
   
       const appointment = new Admission(input);
        return await appointment.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readoneadmission(query:any,selectquery:any,populatequery:any){
    try{
    return await Admission.findOne(query).select(selectquery).populate(populatequery);
    }
    catch(err){
      console.log(err);
      throw new Error(`${configuration.error.errorgeneral} creating admission`);

    }
  }
  
 
  
  //update  appointment by id
  export async function updateadmission(id:any, reqbody:any){
    try{
    const admission = await Admission.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!admission) {
        //return json  false response
        throw new Error(configuration.error.errorrecordnotfound);
      }
      return admission;
    }catch(err){
      console.log(err);
      throw new Error(`${configuration.error.errorgeneral} updating admission`);

    }

  }
  //update  appointment by query
  export async function updateadmissionbyquery(query:any, reqbody:any){
    try{
    const admission = await Admission.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!admission) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return admission;
    }catch(err){
      console.log(err);
      throw new Error(`${configuration.error.errorgeneral} updating admission`);

    }

  }
  