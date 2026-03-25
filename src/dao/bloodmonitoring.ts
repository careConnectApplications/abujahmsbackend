import Bloodmonitoring from "../models/bloodmonitoringchart";
import configuration from "../config";

  //read all patient history
  export async function readallbloodmonitoring(query:any,selectquery:any,populatequery:any,populatesecondquery:any) {
    try {
      const bloodmonitoringdetails = await Bloodmonitoring.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
      const totalbloodmonitoringdetails = await Bloodmonitoring.find(query).countDocuments();
      return { bloodmonitoringdetails, totalbloodmonitoringdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve blood monitoring data");
    }
  };
  export async function createbloodmonitoring(input:any){
    try{
      console.log('///////////',input);
       const bloodmonitoring = new Bloodmonitoring(input);
        return await bloodmonitoring.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create blood monitoring");

    }
  }
  //find one
  export async function readonebloodmonitoring(query:any,selectquery:any){
    try{
    return await Bloodmonitoring.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve blood monitoring data");

    }
  }
  
 

  export async function updatebloodmonitoring(id:any, reqbody:any){
    try{
    const bloodmonitoring = await Bloodmonitoring.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!bloodmonitoring) {
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return bloodmonitoring;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update blood monitoring");

    }

  }
  //update  appointment by query
  export async function updatebloodmonitoringquery(query:any, reqbody:any){
    try{
    const bloodmonitoring = await Bloodmonitoring.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!bloodmonitoring) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return bloodmonitoring;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update blood monitoring");

    }

  }
  