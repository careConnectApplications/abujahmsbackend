import Conscentooperation from "../models/conscenttooperation";
import configuration from "../config";


  //read all patient history
  export async function readallconscentooperations(query:any,selectquery:any) {
    try {
      const conscentooperationdetails = await Conscentooperation.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalconscentooperationdetails = await Conscentooperation.find(query).countDocuments();
      return { conscentooperationdetails, totalconscentooperationdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createconscentooperation(input:any){
    try{
      console.log('///////////',input);
       const conscentooperation = new Conscentooperation(input);
        return await conscentooperation.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readoneconscentooperation(query:any,selectquery:any,populatequery:any){
    try{
    return await Conscentooperation.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  appointment by id
  export async function updateconscentooperation(id:any, reqbody:any){
    try{
    const conscentooperation = await Conscentooperation.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!conscentooperation) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return conscentooperation;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updateconscentooperationquery(query:any, reqbody:any){
    try{
    const conscentooperation = await Conscentooperation.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!conscentooperation) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return conscentooperation;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  