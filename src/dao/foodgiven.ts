import Foodgiven from "../models/foodgiven";
import configuration from "../config";


  //read all patient history
  export async function readallfoodgivens(query:any,selectquery:any) {
    try {
      const foodgivendetails = await Foodgiven.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalfoodgivendetails = await Foodgiven.find(query).countDocuments();
      return { foodgivendetails, totalfoodgivendetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve food administration data");
    }
  };
  export async function createfoodgiven(input:any){
    try{
  
       const foodgiven = new Foodgiven(input);
        return await foodgiven.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create food administration");

    }
  }
  //find one
  export async function readonefoodgiven(query:any,selectquery:any,populatequery:any){
    try{
    return await Foodgiven.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve food administration data");

    }
  }
  
 
  
  //update  appointment by id
  export async function updatefoodgiven(id:any, reqbody:any){
    try{
    const foodgiven = await Foodgiven.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
    
      if (!foodgiven) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return foodgiven;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update food administration");

    }

  }
  //update  appointment by query
  export async function updatefoodgivenquery(query:any, reqbody:any){
    try{
    const foodgiven = await Foodgiven.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!foodgiven) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return foodgiven;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update food administration");

    }

  }
  