import Nursingcareplan from "../models/nursingcareplan";
import configuration from "../config";

  //read all patient history
  export async function readallnursingcareplan(query:any,selectquery:any,populatequery:any,populatesecondquery:any) {
    try {
      const nursingcareplandetails = await Nursingcareplan.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
      const totalnursingcareplandetails = await Nursingcareplan.find(query).countDocuments();
      return { nursingcareplandetails, totalnursingcareplandetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve nursing care plan data");
    }
  };
  export async function createnursingcareplan(input:any){
    try{
      console.log('///////////',input);
       const nursingcareplan = new Nursingcareplan(input);
        return await nursingcareplan.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create nursing care plan");

    }
  }
  //find one
  export async function readonenursingcareplan(query:any,selectquery:any){
    try{
    return await Nursingcareplan.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve nursing care plan data");

    }
  }
  
 

  export async function updatenursingcareplan(id:any, reqbody:any){
    try{
    const nursingcareplan = await Nursingcareplan.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!nursingcareplan) {
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return nursingcareplan;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update nursing care plan");

    }

  }
  //update  appointment by query
  export async function updatenursingcareplanequery(query:any, reqbody:any){
    try{
    const nursingcareplan = await Nursingcareplan.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!nursingcareplan) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return nursingcareplan;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update nursing care plan");

    }

  }
  