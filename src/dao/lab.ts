import Lab from "../models/lab";
import {labinterface} from '../models/lab'
import configuration from "../config";

  //read all lab history
  export async function readalllab(query:any,selectquery:any,populatequery:any,populatesecondquery:any,populatethirdquery:any) {
    try {
      const labdetails = await Lab.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).populate(populatethirdquery);
      const totallabdetails = await Lab.find(query).countDocuments();
      return { labdetails, totallabdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createlab(input:any){
    try{
       const lab = new Lab(input);
        return await lab.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonelab(query:any,selectquery:any,populatequery:any){
    try{
    return await Lab.findOne(query).select(selectquery).populate(populatequery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  lab by id
  export async function updatelab(id:any, reqbody:any){
    try{
    const lab = await Lab.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!lab) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return lab;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updatelabbyquery(query:any, reqbody:any){
    try{
    const lab = await Lab.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!lab) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return lab;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  

  export async function readlabaggregate(input:any) {
    try{
    return await Lab.aggregate(input);
    }
    catch(e:any){
      console.log(e);
      throw new Error(configuration.error.erroruserupdate);
    }
    }