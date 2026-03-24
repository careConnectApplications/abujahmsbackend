import Outreachmedication from "../models/outreachmedication";
import configuration from "../config";

  //read all outreach medication
  export async function readalloutreachmedication(query:any,selectquery:any) {
    try {
      const outreachmedicationdetails = await Outreachmedication.find(query).select(selectquery).sort({ createdAt: -1 });
      const totaloutreachmedicationdetails = await Outreachmedication.find(query).countDocuments();
      return { outreachmedicationdetails, totaloutreachmedicationdetails };
    } catch (err) {
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to retrieve outreach medication data");
=======
      throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    }
  };
  export async function createoutreachmedication(input:any){
    try{
   
       const outreachmedication = new Outreachmedication(input);
        return await outreachmedication.save();
    }
    catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to create outreach medication");
=======
      throw new Error(configuration.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }
  }
  //find one
  export async function readoneoutreachmedication(query:any,selectquery:any){
    try{
    return await Outreachmedication.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to retrieve outreach medication data");
=======
      throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }
  }
  
 
  
  //update  management by id
  export async function updateoutreachmedication(id:any, reqbody:any){
    try{
    const outreachmedication = await Outreachmedication.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!Outreachmedication) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return outreachmedication;
    }catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to update outreach medication");
=======
      throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }

  }
  //update  bedmanagement by query
  export async function updateoutreachmedicationbyquery(query:any, reqbody:any){
    try{
    const outreachmedication = await Outreachmedication.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!outreachmedication) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return outreachmedication;
    }catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to update outreach medication");
=======
      throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }

  }
  