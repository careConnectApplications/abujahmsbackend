import Dailywardreport from "../models/dailywardreport";
import configuration from "../config";

  //read all patient history
  export async function readalldailywardreport(query:any,selectquery:any,populatequery:any) {
    try {
      const dailywardreportsdetails = await Dailywardreport.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
      const totaldailywardreportsdetails = await Dailywardreport.find(query).countDocuments();
      return { dailywardreportsdetails, totaldailywardreportsdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve daily ward report data");
    }
  };
  export async function createdailywardreports(input:any){
    try{
      console.log('///////////',input);
       const dailywardreports = new Dailywardreport(input);
        return await dailywardreports.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create daily ward report");

    }
  }
  //find one
  export async function readonedailywardreports(query:any,selectquery:any){
    try{
    return await Dailywardreport.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve daily ward report data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatedailywardreports(id:any, reqbody:any){
    try{
    const dailywardreport = await Dailywardreport.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!dailywardreport) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return dailywardreport;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update daily ward report");

    }

  }
  //update  appointment by query
  export async function updatedailywardreportquery(query:any, reqbody:any){
    try{
    const dailywardreport = await Dailywardreport.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!dailywardreport) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return dailywardreport;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update daily ward report");

    }

  }
  