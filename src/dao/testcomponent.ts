import Testcomponent from "../models/testcomponents";
import configuration from "../config";

  //read all patient history
  export async function readalltestcomponent(query:any,selectquery:any) {
    try {
      const testcomponentdetails = await Testcomponent.find(query).select(selectquery).sort({ createdAt: -1 });
      const totaltestcomponentdetails = await Testcomponent.find(query).countDocuments();
      return { testcomponentdetails, totaltestcomponentdetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve test component data");
    }
  };
  export async function createtestcomponent(input:any){
    try{
      console.log('///////////',input);
       const testcomponent = new Testcomponent(input);
        return await testcomponent.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create test component");

    }
  }
  //find one
  export async function readonetestcomponent(query:any,selectquery:any){
    try{
    return await Testcomponent.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve test component data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatetestcomponent(id:any, reqbody:any){
    try{
    const testcomponent = await Testcomponent.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!testcomponent) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return testcomponent;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update test component");

    }

  }
  //update  appointment by query
  export async function updatetestcomponentyquery(query:any, reqbody:any){
    try{
    const testcomponent = await Testcomponent.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!testcomponent) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return testcomponent;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update test component");

    }

  }

  export async function createmanytestcomponent(filterinput:any,input:any){
    try{
      console.log(input);
      return await Testcomponent.updateOne(
        filterinput,
        input,
        { upsert: true }   );
              
        
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create test component");

    }
  }
  
  