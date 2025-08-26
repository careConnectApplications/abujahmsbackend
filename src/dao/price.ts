import Price from "../models/pricefornewregandappointment";
import {priceinterface} from '../models/pricefornewregandappointment'
import configuration from "../config";


  //read all payment history
  export async function readallprices(query:any,selectquery:any) {
    try {
      const pricedetails = await Price.find(query).select(selectquery).sort({ createdAt: -1 });
      const totalpricedetails = await Price.find(query).countDocuments();
      return { pricedetails, totalpricedetails };
    } catch (err) {
      console.log(err);
      throw new Error("Failed to retrieve price data");
    }
  };
  export async function createmanyprice(filterinput:any,input:any){
    try{
      console.log(input);
      return Price.updateOne(
        filterinput,
        input,
        { upsert: true }   );
              
        
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create price");

    }
  }
  export async function createprice(input:any){
    try{
       const user = new Price(input);
        return await user.save();
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create price");

    }
  }
  //find one
  export async function readoneprice(query:any){
    try{
    return await Price.findOne(query);
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to retrieve price data");

    }
  }
  
 
  
  //update  users
  export async function updateprice(id:any, reqbody:any){
    try{
    const user = await Price.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!user) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return user;
    }catch(err){
      console.log(err);
      throw new Error("Failed to update price");

    }

  }
  