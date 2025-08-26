import Deliverynote from "../models/deliverynote";
import configuration from "../config";

  //read all patient history
  export async function readalldeliverynotes(query:any,selectquery:any,populatequery:any) {
    try {
      const deliverynotesdetails = await Deliverynote.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
      const totaldeliverynotesdetails = await Deliverynote.find(query).countDocuments();
      return { deliverynotesdetails, totaldeliverynotesdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve delivery note data");
    }
  };
  export async function createdeliverynotes(input:any){
    try{
      console.log('///////////',input);
       const deliverynotes = new Deliverynote(input);
        return await deliverynotes.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create delivery note");

    }
  }
  //find one
  export async function readonedeliverynotes(query:any,selectquery:any){
    try{
    return await Deliverynote.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve delivery note data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatedeliverynotes(id:any, reqbody:any){
    try{
    const deliverynote = await Deliverynote.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!deliverynote) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return deliverynote;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update delivery note");

    }

  }
  //update  appointment by query
  export async function updatedeliverynotequery(query:any, reqbody:any){
    try{
    const deliverynote = await Deliverynote.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!deliverynote) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return deliverynote;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update delivery note");

    }

  }
  