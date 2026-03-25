import Medicationcharts from "../models/medicationcharts";
import configuration from "../config";

  //read all patient history
  export async function readallmedicationcharts(query:any,selectquery:any,populatequery:any,populatesecondquery:any) {
    try {
      const medicationchartsdetails = await Medicationcharts.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
      const totalmedicationchartsdetails = await Medicationcharts.find(query).countDocuments();
      return { medicationchartsdetails, totalmedicationchartsdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve medication chart data");
    }
  };
  export async function createmedicationcharts(input:any){
    try{
      console.log('///////////',input);
       const medicationcharts = new Medicationcharts(input);
        return await medicationcharts.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create medication chart");

    }
  }
  //find one
  export async function readonemedicationcharts(query:any,selectquery:any){
    try{
    return await Medicationcharts.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve medication chart data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatemedicationcharts(id:any, reqbody:any){
    try{
    const medication = await Medicationcharts.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!medication) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return medication;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update medication chart");

    }

  }
  //update  appointment by query
  export async function updatemedicationyquery(query:any, reqbody:any){
    try{
    const medication = await Medicationcharts.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!medication) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return medication;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update medication chart");

    }

  }
  