import Nutrition from "../models/nutrition";
import configuration from "../config";

  //read all patient history
  export async function readallnutrition(query:any,selectquery:any,populatequery:any) {
    try {
      const nutritiondetails = await Nutrition.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
      const totalnutritiondetails = await Nutrition.find(query).countDocuments();
      return { nutritiondetails, totalnutritiondetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createnutrition(input:any){
    try{
      console.log('///////////',input);
       const nutrition = new Nutrition(input);
        return await nutrition.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonenutrition(query:any,selectquery:any){
    try{
    return await Nutrition.findOne(query).select(selectquery);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 

  export async function updatenutrition(id:any, reqbody:any){
    try{
    const nutrition = await Nutrition.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!nutrition) {
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return nutrition;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updatenutritionquery(query:any, reqbody:any){
    try{
    const nutrition = await Nutrition.findOneAndUpdate(query, reqbody,{
      new: true
    });
      if (!nutrition) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return nutrition;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  