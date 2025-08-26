import Vitalsignscore from "../models/vitalsignscore";
import configuration from "../config";


  //read all patient history
  export async function readallvitalsignscores(query:any,selectquery:any) {
    try {
      const vitalsignscoredetails = await Vitalsignscore.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalvitalsignscoredetails = await Vitalsignscore.find(query).countDocuments();
      return { vitalsignscoredetails, totalvitalsignscoredetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve vital sign score data");
    }
  };
  export async function createvitalsignscore(input:any){
    try{
  
       const vitalsignscore = new Vitalsignscore(input);
        return await vitalsignscore.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create vital sign score");

    }
  }
  //find one
  export async function readonevitalsignscore(query:any,selectquery:any,populatequery:any){
    try{
    return await Vitalsignscore.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve vital sign score data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatevitalsignscore(id:any, reqbody:any){
    try{
    const vitalsignscore = await Vitalsignscore.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!vitalsignscore) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return vitalsignscore;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update vital sign score");

    }

  }
  //update  appointment by query
  export async function updatevitalsignscorequery(query:any, reqbody:any){
    try{
    const vitalsignscore = await Vitalsignscore.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!vitalsignscore) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return vitalsignscore;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update vital sign score");

    }

  }
  