import Pathograph from "../models/pathograph";
import configuration from "../config";

  //read all patient history
  export async function readallpathograph(query:any,selectquery:any,populatequery:any) {
    try {
      const pathographdetails = await Pathograph.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
      const totalpathographdetails = await Pathograph.find(query).countDocuments();
      return { pathographdetails, totalpathographdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve pathograph data");
    }
  };
  export async function createpathograph(input:any){
    try{
       const pathograph = new Pathograph(input);
        return await pathograph.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create pathograph");

    }
  }
  //find one
  export async function readonepathograph(query:any,selectquery:any){
    try{
    return await Pathograph.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve pathograph data");

    }
  }
  
 

  export async function updatepathograph(id:any, reqbody:any){
    try{
    const pathograph = await Pathograph.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!pathograph) {
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return pathograph;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update pathograph");

    }

  }
  //update  appointment by query
  export async function updatepathographquery(query:any, reqbody:any){
    try{
    const pathograph = await Pathograph.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!pathograph) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return pathograph;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update pathograph");

    }

  }
  