import Progressreport from "../models/progressreport";
import configuration from "../config";

  //read all patient history
  export async function readallprogressreports(query:any,selectquery:any,populatequery:any,populatesecondquery:any) {
    try {
      const readallprogressreportdetails = await Progressreport.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
      const totalprogressreportdetails = await Progressreport.find(query).countDocuments();
      return { readallprogressreportdetails, totalprogressreportdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve progress report data");
    }
  };
  export async function createprogressreports(input:any){
    try{
      console.log('///////////',input);
       const progressreports = new Progressreport(input);
        return await progressreports.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create progress report");

    }
  }
  //find one
  export async function readoneprogressreports(query:any,selectquery:any){
    try{
    return await Progressreport.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve progress report data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updateprogressreports(id:any, reqbody:any){
    try{
    const progressreport = await Progressreport.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!progressreport) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return progressreport;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update progress report");

    }

  }
  //update  appointment by query
  export async function updateprogressreportquery(query:any, reqbody:any){
    try{
    const medication = await Progressreport.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!medication) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return medication;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update progress report");

    }

  }
  