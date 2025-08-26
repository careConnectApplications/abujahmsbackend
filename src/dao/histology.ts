import Histologyrequest from "../models/histology";
import configuration from "../config";


  //read all patient history
  export async function readallhistologyrequests(query:any,selectquery:any) {
    try {
      const histologydetails = await Histologyrequest.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalhistologydetails = await Histologyrequest.find(query).countDocuments();
      return { histologydetails, totalhistologydetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve histology data");
    }
  };
  export async function createhistologyrequest(input:any){
    try{
      console.log('///////////',input);
       const histology = new Histologyrequest(input);
        return await histology.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create histology");

    }
  }
  //find one
  export async function readonehistology(query:any,selectquery:any,populatequery:any){
    try{
    return await Histologyrequest.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve histology data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatehistology(id:any, reqbody:any){
    try{
    const histology = await Histologyrequest.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!histology) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return histology;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update histology");

    }

  }
  //update  appointment by query
  export async function updatehistologyquery(query:any, reqbody:any){
    try{
    const histology = await Histologyrequest.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!histology) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return histology;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update histology");

    }

  }
  
