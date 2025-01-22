import Servicetype from "../models/servicetype";
import configuration from "../config";

  //read all patient history
  export async function readallservicetype(query:any,selectquery:any) {
    try {
      const servicetypedetails = await Servicetype.find(query).select(selectquery);
      const totalservicetypedetails = await Servicetype.find(query).countDocuments();
      return { servicetypedetails, totalservicetypedetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createservicetype(input:any){
    try{
      console.log('///////////',input);
       const servicetype = new Servicetype(input);
        return await servicetype.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readoneservicetype(query:any,selectquery:any){
    try{
    return await Servicetype.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  appointment by id
  export async function updateservicetype(id:any, reqbody:any){
    try{
    const servicetype = await Servicetype.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!servicetype) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return servicetype;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updateservicetypeyquery(query:any, reqbody:any){
    try{
    const servicetype = await Servicetype.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!servicetype) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return servicetype;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }

  export async function createmanyservicetype(filterinput:any,input:any){
    try{
      console.log(input);
      return await Servicetype.updateOne(
        filterinput,
        input,
        { upsert: true }   );
              
        
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  
  