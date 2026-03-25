import Vitalcharts from "../models/vitalcharts";
import configuration from "../config";

  //read all patient history
  export async function readallvitalcharts(query:any,selectquery:any,populatequery:any,populatesecondquery:any) {
    try {
      const vitalchartsdetails = await Vitalcharts.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
      const totalvitalchartsdetails = await Vitalcharts.find(query).countDocuments();
      return { vitalchartsdetails, totalvitalchartsdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve vital chart data");
    }
  };
  export async function createvitalcharts(input:any){
    try{
      console.log('///////////',input);
       const vitalcharts = new Vitalcharts(input);
        return await vitalcharts.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create vital chart");

    }
  }
  //find one
  export async function readonevitalcharts(query:any,selectquery:any){
    try{
    return await Vitalcharts.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve vital chart data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatevitalcharts(id:any, reqbody:any){
    try{
    const vital = await Vitalcharts.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!vital) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return vital;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update vital chart");

    }

  }
  //update  appointment by query
  export async function updatevitalyquery(query:any, reqbody:any){
    try{
    const vital = await Vitalcharts.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!vital) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return vital;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update vital chart");

    }

  }
  