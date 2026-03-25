import Preanathetics from "../models/preanatheticsform";
import configuration from "../config";


  //read all patient history
  export async function readallpreanathetics(query:any,selectquery:any) {
    try {
      const preanatheticsdetails = await Preanathetics.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalpreanatheticsdetails = await Preanathetics.find(query).countDocuments();
      return { preanatheticsdetails, totalpreanatheticsdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve pre-anaesthetic data");
    }
  };
  export async function createpreanathetics(input:any){
    try{
      console.log('///////////',input);
       const preanathetics = new Preanathetics(input);
        return await preanathetics.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create pre-anaesthetic");

    }
  }
  //find one
  export async function readonepreanathetics(query:any,selectquery:any,populatequery:any){
    try{
    return await Preanathetics.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve pre-anaesthetic data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatepreanathetics(id:any, reqbody:any){
    try{
    const preanathetics = await Preanathetics.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!preanathetics) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return preanathetics;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update pre-anaesthetic");

    }

  }
  //update  appointment by query
  export async function updatepreanatheticsquery(query:any, reqbody:any){
    try{
    const preanathetics = await Preanathetics.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!preanathetics) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return preanathetics;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update pre-anaesthetic");

    }

  }
  
