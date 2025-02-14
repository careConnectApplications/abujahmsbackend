import Radiology from "../models/radiology";
import configuration from "../config";

  //read all lab history
  export async function readallradiology(query:any,selectquery:any,populatequery:any,populatesecondquery:any) {
    try {
      const radiologydetails = await Radiology.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
      const totalradiologydetails = await Radiology.find(query).countDocuments();
      return { radiologydetails, totalradiologydetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createradiology(input:any){
    try{
       const radiology = new Radiology(input);
        return await radiology.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readoneradiology(query:any,selectquery:any,populatequery:any){
    try{
    return await Radiology.findOne(query).select(selectquery).populate(populatequery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  lab by id
  export async function updateradiology(id:any, reqbody:any){
    try{
    const radiology = await Radiology.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!radiology) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return radiology;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updateradiologybyquery(query:any, reqbody:any){
    try{
    const radiology = await Radiology.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!radiology) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return radiology;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  

  export async function readradiologyaggregate(input:any) {
    try{
    return await Radiology.aggregate(input);
    }
    catch(e:any){
      console.log(e);
      throw new Error(configuration.error.erroruserupdate);
    }
    }