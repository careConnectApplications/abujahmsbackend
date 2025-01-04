/*import Vitals from "../models/vitals";
import configuration from "../config";

  //read all patient history
  export async function readallVitals(query:any,selectquery:any) {
    try {
      const vitaldetails = await Vitals.find(query).select(selectquery);
      const totalvitaldetails = await Vitals.find(query).countDocuments();
      return { vitaldetails, totalvitaldetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createvital(input:any){
    try{
      console.log('///////////',input);
       const vital = new Vitals(input);
        return await vital.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonevital(query:any,selectquery:any){
    try{
    return await Vitals.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  appointment by id
  export async function updatevital(id:any, reqbody:any){
    try{
    const vital = await Vitals.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!vital) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return vital;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updatevitalquery(query:any, reqbody:any){
    try{
    const vital = await Vitals.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!vital) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return vital;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  */