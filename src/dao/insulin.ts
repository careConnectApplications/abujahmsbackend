import Insulin from "../models/insulinchart";
import configuration from "../config";

  //read all patient history
  export async function readallinsulins(query:any,selectquery:any,populatequery:any,populatesecondquery:any) {
    try {
      const insulindetails = await Insulin.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
      const totalinsulindetails = await Insulin.find(query).countDocuments();
      return { insulindetails, totalinsulindetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve insulin data");
    }
  };
  export async function createinsulins(input:any){
    try{
      console.log('///////////',input);
       const insulin = new Insulin(input);
        return await insulin.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create insulin");

    }
  }
  //find one
  export async function readoneinsulins(query:any,selectquery:any){
    try{
    return await Insulin.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve insulin data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updateinsulins(id:any, reqbody:any){
    try{
    const insulin = await Insulin.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!insulin) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return insulin;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update insulin");

    }

  }
  //update  appointment by query
  export async function updateinsulinquery(query:any, reqbody:any){
    try{
    const insulin = await Insulin.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!insulin) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return insulin;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update insulin");

    }

  }
  