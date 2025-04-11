import Immunization from "../models/immunization";
import configuration from "../config";

  //read all patient history
  export async function readallimmunization(query:any,selectquery:any,populatequery:any) {
    try {
      const immunizationdetails = await Immunization.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
      const totalimmunizationdetails = await Immunization.find(query).countDocuments();
      return { immunizationdetails, totalimmunizationdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createimmunization(input:any){
    try{
      console.log('///////////',input);
       const immunization = new Immunization(input);
        return await immunization.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readoneimmunization(query:any,selectquery:any){
    try{
    return await Immunization.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 

  export async function updateimmunization(id:any, reqbody:any){
    try{
    const immunization = await Immunization.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!immunization) {
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return immunization;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updateimmunizationequery(query:any, reqbody:any){
    try{
    const immunization = await Immunization.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!immunization) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return immunization;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  