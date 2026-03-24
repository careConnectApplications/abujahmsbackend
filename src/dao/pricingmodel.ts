import Pricemodel from "../models/pricingmodel";
import configuration from "../config";


 
 
  export async function createpricemodel(input:any){
    try{
       const pricemodel = new Pricemodel(input);
        return await pricemodel.save();
    }
    catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to create pricing model");
=======
      throw new Error(configuration.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }
  }
  //find one
  export async function readonepricemodel(query:any){
    try{
    return await Pricemodel.findOne(query);
    }
    catch(err){
      console.log(err);
<<<<<<< HEAD
      throw new Error("Failed to retrieve pricing model data");
=======
      throw new Error(configuration.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

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
<<<<<<< HEAD
      throw new Error("Failed to update pricing model");
=======
      throw new Error(configuration.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }

  }
  