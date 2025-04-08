import Familyplanning from "../models/familyplanning";
import configuration from "../config";

  //read all patient history
  export async function readallfamilyplannings(query:any,selectquery:any,populatequery:any) {
    try {
      const familyplanningsdetails = await Familyplanning.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
      const totalfamilyplanningsdetails = await Familyplanning.find(query).countDocuments();
      return { familyplanningsdetails, totalfamilyplanningsdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createfamilyplannings(input:any){
    try{
      console.log('///////////',input);
       const familyplannings = new Familyplanning(input);
        return await familyplannings.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonefamilyplannings(query:any,selectquery:any){
    try{
    return await Familyplanning.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  appointment by id
  export async function updatefamilyplannings(id:any, reqbody:any){
    try{
    const familyplanning = await Familyplanning.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!familyplanning) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return familyplanning;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updatefamilyplanningquery(query:any, reqbody:any){
    try{
    const familyplanning = await Familyplanning.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!familyplanning) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return familyplanning;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  