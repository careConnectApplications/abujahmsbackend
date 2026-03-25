import Clinic from "../models/clinics";
import configuration from "../config";

  //read all patient history
  export async function readallclinics(query:any,selectquery:any) {
    try {
      const clinicdetails = await Clinic.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalclinicdetails = await Clinic.find(query).countDocuments();
      return { clinicdetails, totalclinicdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve clinic data");
    }
  };
  export async function createclinic(input:any){
    try{
      console.log('///////////',input);
       const clinic = new Clinic(input);
        return await clinic.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create clinic");

    }
  }
  //find one
  export async function readoneclinic(query:any,selectquery:any){
    try{
    return await Clinic.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve clinic data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updateclinic(id:any, reqbody:any){
    try{
    const clinic = await Clinic.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!clinic) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return clinic;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update clinic");

    }

  }
  //update  appointment by query
  export async function updateclinicyquery(query:any, reqbody:any){
    try{
    const clinic = await Clinic.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!clinic) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return clinic;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update clinic");

    }

  }
  