import Fluidbalance from "../models/fluidbalance";
import configuration from "../config";

  //read all patient history
  export async function readallfluidbalances(query:any,selectquery:any,populatequery:any,populatesecondquery:any) {
    try {
      const fluidbalancesdetails = await Fluidbalance.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
      const totalfluidbalancesdetails = await Fluidbalance.find(query).countDocuments();
      return { fluidbalancesdetails, totalfluidbalancesdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createfluidbalances(input:any){
    try{
      console.log('///////////',input);
       const fluidbalances = new Fluidbalance(input);
        return await fluidbalances.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonefluidbalances(query:any,selectquery:any){
    try{
    return await Fluidbalance.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 

  export async function updatefluidbalances(id:any, reqbody:any){
    try{
    const fluidbalance = await Fluidbalance.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!fluidbalance) {
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return fluidbalance;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updatefluidbalancequery(query:any, reqbody:any){
    try{
    const fluidbalance = await Fluidbalance.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!fluidbalance) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return fluidbalance;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  