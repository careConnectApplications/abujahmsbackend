import Price from "../models/pricefornewregandappointment";
import {priceinterface} from '../models/pricefornewregandappointment'
import configuration from "../config";


  //read all payment history
  export async function readallprices(query:any) {
    try {
      const pricedetails = await Price.find(query);
      const totalpricedetails = await Price.find(query).countDocuments();
      return { pricedetails, totalpricedetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createmayprice(input:priceinterface){
    try{
      return Price.create(input);
        
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  export async function createprice(input:priceinterface){
    try{
       const user = new Price(input);
        return await user.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readoneprice(query:any){
    try{
    return await Price.findOne(query);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

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
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  