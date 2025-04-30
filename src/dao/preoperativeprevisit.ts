import Preoperativeprevisit from "../models/preoperativeprevisit";
import configuration from "../config";


  //read all patient history
  export async function readallpreoperativeprevisits(query:any,selectquery:any) {
    try {
      const preoperativeprevisitdetails = await Preoperativeprevisit.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalpreoperativeprevisitdetails = await Preoperativeprevisit.find(query).countDocuments();
      return { preoperativeprevisitdetails, totalpreoperativeprevisitdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createpreoperativeprevisit(input:any){
    try{
      console.log('///////////',input);
       const preoperativeprevisit = new Preoperativeprevisit(input);
        return await preoperativeprevisit.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonepreoperativeprevisit(query:any,selectquery:any,populatequery:any){
    try{
    return await Preoperativeprevisit.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  appointment by id
  export async function updatepreoperativeprevisit(id:any, reqbody:any){
    try{
    const preoperativeprevisit = await Preoperativeprevisit.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!preoperativeprevisit) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return preoperativeprevisit;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updatepreoperativeprevisitquery(query:any, reqbody:any){
    try{
    const preoperativeprevisit = await Preoperativeprevisit.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!preoperativeprevisit) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return preoperativeprevisit;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  
