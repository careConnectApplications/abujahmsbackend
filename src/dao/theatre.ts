import Theatre from "../models/theatremanagement";
import configuration from "../config";

  //read all patient history
  export async function readalltheatremanagement(query:any,selectquery:any) {
    try {
      const theatremanagementdetails = await Theatre.find(query).select(selectquery).sort({ createdAt: -1 });
      const totaltheatremanagementdetails = await Theatre.find(query).countDocuments();
      return { theatremanagementdetails, totaltheatremanagementdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve theatre data");
    }
  };
  export async function createtheatremanagement(input:any){
    try{
   
       const theatremanagement = new Theatre(input);
        return await theatremanagement.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create theatre");

    }
  }
  //find one
  export async function readonetheatremanagement(query:any,selectquery:any){
    try{
    return await Theatre.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve theatre data");

    }
  }
  
 
  
  //update  management by id
  export async function updatetheatremanagement(id:any, reqbody:any){
    try{
    const theatremanagement = await Theatre.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!theatremanagement) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return theatremanagement;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update theatre");

    }

  }
  //update  bedmanagement by query
  export async function updatetheatremanagementbyquery(query:any, reqbody:any){
    try{
    const theatremanagement = await Theatre.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!theatremanagement) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return theatremanagement;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update theatre");

    }

  }
  