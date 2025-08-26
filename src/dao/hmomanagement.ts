import Hmomanagement from "../models/hmomanagement";
import configuration from "../config";

  //read all patient history
  export async function readallhmomanagement(query:any,selectquery:any) {
    try {
      const hmomanagementdetails = await Hmomanagement.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalhmomanagementdetails = await Hmomanagement.find(query).countDocuments();
      return { hmomanagementdetails, totalhmomanagementdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve HMO data");
    }
  };
  export async function createhmomanagement(input:any){
    try{
   
       const hmomanagement = new Hmomanagement(input);
        return await hmomanagement.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create HMO");

    }
  }
  //find one
  export async function readonehmomanagement(query:any,selectquery:any){
    try{
    return await Hmomanagement.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve HMO data");

    }
  }
  
 
  
  //update  management by id
  export async function updatehmomanagement(id:any, reqbody:any){
    try{
    const hmomanagement = await Hmomanagement.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!hmomanagement) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return hmomanagement;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update HMO");

    }

  }
  //update  bedmanagement by query
  export async function updatehmomanagementbyquery(query:any, reqbody:any){
    try{
    const hmomanagement = await Hmomanagement.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!hmomanagement) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return hmomanagement;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update HMO");

    }

  }
  