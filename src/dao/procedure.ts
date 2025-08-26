import Procedure from "../models/procedure";
import configuration from "../config";

export async function countprocedure(query:any) {
  try {
    
    return await Procedure.countDocuments(query);
   
  } catch (err) {
    console.log(err);
    throw new Error("Failed to retrieve procedure data");
  }
};

  //read all lab history
  export async function readallprocedure(query:any,selectquery:any,populatequery:any,populatesecondquery:any) {
    try {
      const proceduredetails = await Procedure.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
      const totalproceduredetails = await Procedure.find(query).countDocuments();
      return { proceduredetails, totalproceduredetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve procedure data");
    }
  };
  export async function createprocedure(input:any){
    try{
       const procedure = new Procedure(input);
        return await procedure.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create procedure");

    }
  }
  //find one
  export async function readoneprocedure(query:any,selectquery:any,populatequery:any){
    try{
    return await Procedure.findOne(query).select(selectquery).populate(populatequery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve procedure data");

    }
  }
  
 
  
  //update  lab by id
  export async function updateprocedure(id:any, reqbody:any){
    try{
    const procedure = await Procedure.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!procedure) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return procedure;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update procedure");

    }

  }
  //update  appointment by query
  export async function updateprocedurebyquery(query:any, reqbody:any){
    try{
    const procedure = await Procedure.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!procedure) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return procedure;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update procedure");

    }

  }
  
    export async function readprocedureaggregateoptimized(input:any, page:any, size:any) {
    try{
      const skip = (page - 1) * size;
    const prodecuredetails= await Procedure.aggregate(input).skip(skip).limit(size).sort({ createdAt: -1 });
     const totalproceduredetails = (await Procedure.aggregate(input)).length;
      const totalPages = Math.ceil(totalproceduredetails / size);
      return { prodecuredetails, totalPages,totalproceduredetails, size, page};
    }
    catch(e:any){
      console.log(e);
      throw new Error("Failed to update procedure");
    }
    }
  export async function readprocedureaggregate(input:any) {
    try{
    return await Procedure.aggregate(input);
    }
    catch(e:any){
      console.log(e);
      throw new Error("Failed to update procedure");
    }
    }