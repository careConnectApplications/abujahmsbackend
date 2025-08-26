import Operationnotes from "../models/operationnotes";
import configuration from "../config";


  //read all patient history
  export async function readalloperationnotes(query:any,selectquery:any) {
    try {
      const operationnotesdetails = await Operationnotes.find(query).select(selectquery).sort({ createdAt: -1 });
      const totaloperationnotes = await Operationnotes.find(query).countDocuments();
      return { operationnotesdetails, totaloperationnotes };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve operation notes data");
    }
  };
  export async function createoperationnote(input:any){
    try{
      
       const operationnote = new Operationnotes(input);
        return await operationnote.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create operation notes");

    }
  }
  //find one
  export async function readoneoperationnote(query:any,selectquery:any,populatequery:any){
    try{
    return await Operationnotes.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve operation notes data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updateoperationnote(id:any, reqbody:any){
    try{
    const operationnote = await Operationnotes.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!operationnote) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return operationnote;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update operation notes");

    }

  }
  //update  appointment by query
  export async function updateoperationnotequery(query:any, reqbody:any){
    try{
    const operationnote = await Operationnotes.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!operationnote) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return operationnote;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update operation notes");

    }

  }
  
