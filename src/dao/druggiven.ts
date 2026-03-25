import Druggiven from "../models/druggiven";
import configuration from "../config";


  //read all patient history
  export async function readalldruggivens(query:any,selectquery:any) {
    try {
      const druggivendetails = await Druggiven.find(query).select(selectquery).sort({ createdAt: -1 });
      const totaldruggivendetails = await Druggiven.find(query).countDocuments();
      return { druggivendetails, totaldruggivendetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve drug administration data");
    }
  };
  export async function createdruggiven(input:any){
    try{
  
       const druggiven = new Druggiven(input);
        return await druggiven.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create drug administration");

    }
  }
  //find one
  export async function readonedruggiven(query:any,selectquery:any,populatequery:any){
    try{
    return await Druggiven.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve drug administration data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatedruggiven(id:any, reqbody:any){
    try{
    const druggiven = await Druggiven.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!druggiven) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return druggiven;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update drug administration");

    }

  }
  //update  appointment by query
  export async function updatedruggivenquery(query:any, reqbody:any){
    try{
    const druggiven = await Druggiven.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!druggiven) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return druggiven;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update drug administration");

    }

  }
  