import Wardmanagement from "../models/wardmanagement";
import configuration from "../config";

  //read all patient history
  export async function readallwardmanagement(query:any,selectquery:any) {
    try {
      const wardmanagementdetails = await Wardmanagement.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalwardmanagementdetails = await Wardmanagement.find(query).countDocuments();
      return { wardmanagementdetails, totalwardmanagementdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createwardmanagement(input:any){
    try{
   
       const wardmanagement = new Wardmanagement(input);
        return await wardmanagement.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonewardmanagement(query:any,selectquery:any){
    try{
    return await Wardmanagement.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  management by id
  export async function updatewardmanagement(id:any, reqbody:any){
    try{
    const wardmanagement = await Wardmanagement.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!wardmanagement) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return wardmanagement;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  bedmanagement by query
  export async function updatewardmanagementbyquery(query:any, reqbody:any){
    try{
    const wardmanagement = await Wardmanagement.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!wardmanagement) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return wardmanagement;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  