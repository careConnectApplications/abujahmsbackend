import Payment from "../models/payment";
import {paymentinterface} from '../models/payment'
import configuration from "../config";

  //read all payment history
  export async function readallpayment(query:any) {
    try {
      const paymentdetails = await Payment.find(query);
      const totalpaymentdetails = await Payment.countDocuments();
      return { paymentdetails, totalpaymentdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createpayment(input:paymentinterface){
    try{
       const user = new Payment(input);
        return await user.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonepayment(query:any){
    try{
    return await Payment.findOne(query);
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  users
  export async function updatepayment(id:any, reqbody:any){
    try{
    const user = await Payment.findOneAndUpdate({ _id: id }, reqbody,{
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
  