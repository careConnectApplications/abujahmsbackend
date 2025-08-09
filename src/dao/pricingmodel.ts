import Pricemodel from "../models/pricingmodel";
import configuration from "../config";


 
 
  export async function createpricemodel(input:any){
    try{
       const pricemodel = new Pricemodel(input);
        return await pricemodel.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonepricemodel(query:any){
    try{
    return await Pricemodel.findOne(query);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  users
  export async function updatepricemodel(id:any, reqbody:any){
    try{
    const pricemodel = await Pricemodel.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!pricemodel) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return pricemodel;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  