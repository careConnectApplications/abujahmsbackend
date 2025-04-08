import Tubefeedingchart from "../models/tubefeedingchart";
import configuration from "../config";

  //read all patient history
  export async function readalltubefeedingcharts(query:any,selectquery:any,populatequery:any,populatesecondquery:any) {
    try {
      const tubefeedingchartsdetails = await Tubefeedingchart.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
      const totaltubefeedingchartsdetails = await Tubefeedingchart.find(query).countDocuments();
      return { tubefeedingchartsdetails, totaltubefeedingchartsdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createtubefeedingcharts(input:any){
    try{
      console.log('///////////',input);
       const tubefeedingcharts = new Tubefeedingchart(input);
        return await tubefeedingcharts.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonetubefeedingcharts(query:any,selectquery:any){
    try{
    return await Tubefeedingchart.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  appointment by id
  export async function updatetubefeedingcharts(id:any, reqbody:any){
    try{
    const tubefeedingchart = await Tubefeedingchart.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!tubefeedingchart) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return tubefeedingchart;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updatetubefeedingchartquery(query:any, reqbody:any){
    try{
    const tubefeedingchart = await Tubefeedingchart.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!tubefeedingchart) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return tubefeedingchart;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  