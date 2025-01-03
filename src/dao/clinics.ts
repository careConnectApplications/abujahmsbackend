import Clinic from "../models/clinics";
import {appointinterface} from '../models/appointment'
import {encrypt} from "../utils/otherservices";
import configuration from "../config";

  //read all patient history
  export async function readallclinics(query:any,selectquery:any) {
    try {
      const clinicdetails = await Clinic.find(query).select(selectquery);
      const totalclinicdetails = await Clinic.find(query).countDocuments();
      return { clinicdetails, totalclinicdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createclinic(input:any){
    try{
      console.log('///////////',input);
       const clinic = new Clinic(input);
        return await clinic.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readoneclinic(query:any,selectquery:any){
    try{
    return await Clinic.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  appointment by id
  export async function updateclinic(id:any, reqbody:any){
    try{
    const clinic = await Clinic.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!clinic) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return clinic;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updateclinicyquery(query:any, reqbody:any){
    try{
    const clinic = await Clinic.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!clinic) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return clinic;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  