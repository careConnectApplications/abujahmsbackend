import ANC from "../models/anc3";
import configuration from "../config";




  //read all patient history
  export async function readallanc(query:any,selectquery:any,populatequery:any) {
    try {
      const ancdetails = await ANC.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
      const totalancdetails = await ANC.find(query).countDocuments();
      return { ancdetails, totalancdetails };
    } catch (err) {
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to retrieve ANC data");
=======
      throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    }
  };
  export async function createanc(input:any){
    try{
   
       const anc = new ANC(input);
        return await anc.save();
    }
    catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to create ANC");
=======
      throw new Error(configuration.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }
  }
  //find one
  export async function readoneanc(query:any,selectquery:any,populatequery:any){
    try{
    return await ANC.findOne(query).select(selectquery).populate(populatequery);
    }
    catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to retrieve ANC data");
=======
      throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }
  }
  
 
  
  //update  appointment by id
  export async function updateanc(id:any, reqbody:any){
    try{
    const anc = await ANC.findOneAndUpdate({ _id: id }, reqbody,{
      upsert: true,new: true
    });
    
    
      if (!anc) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
        
      return anc;
    }catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to update ANC");
=======
      throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }

  }
  //update  appointment by query
  export async function updateancbyquery(query:any, reqbody:any){
    try{
    const anc = await ANC.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!anc) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return anc;
    }catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to update ANC");
=======
      throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }

  }
  