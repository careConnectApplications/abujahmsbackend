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
<<<<<<< HEAD
      throw new Error("Failed to retrieve operation notes data");
=======
      throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    }
  };
  export async function createoperationnote(input:any){
    try{
      
       const operationnote = new Operationnotes(input);
        return await operationnote.save();
    }
    catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to create operation notes");
=======
      throw new Error(configuration.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }
  }
  //find one
  export async function readoneoperationnote(query:any,selectquery:any,populatequery:any){
    try{
    return await Operationnotes.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to retrieve operation notes data");
=======
      throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

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
<<<<<<< HEAD
      throw new Error("Failed to update operation notes");
=======
      throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

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
<<<<<<< HEAD
      throw new Error("Failed to update operation notes");
=======
      throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }

  }
  
