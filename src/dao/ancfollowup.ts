import Ancfollowup from "../models/ancfollowup";
import configuration from "../config";

  //read all patient history
  export async function readallancfollowup(query:any,selectquery:any,populatequery:any) {
    try {
      const ancfollowupdetails = await Ancfollowup.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
      const totalancfollowupdetails = await Ancfollowup.find(query).countDocuments();
      return { ancfollowupdetails, totalancfollowupdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve ANC follow-up data");
    }
  };
  export async function createancfollowup(input:any){
    try{
      console.log('///////////',input);
       const ancfollowup = new Ancfollowup(input);
        return await ancfollowup.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create ANC follow-up");

    }
  }
  //find one
  export async function readoneancfollowup(query:any,selectquery:any){
    try{
    return await Ancfollowup.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve ANC follow-up data");

    }
  }
  
 

  export async function updateancfollowup(id:any, reqbody:any){
    try{
    const ancfollowup = await Ancfollowup.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!ancfollowup) {
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return ancfollowup;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update ANC follow-up");

    }

  }
  //update  appointment by query
  export async function updateancfollowupquery(query:any, reqbody:any){
    try{
    const ancfollowup = await Ancfollowup.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!ancfollowup) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return ancfollowup;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update ANC follow-up");

    }

  }
  