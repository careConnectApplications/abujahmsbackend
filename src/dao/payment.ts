import Payment from "../models/payment";
import {paymentinterface} from '../models/payment'
import configuration from "../config";

  //read all payment history
  export async function readallpayment(query:any,populatequery:any) {
    try {
     
      const paymentdetails = await Payment.find(query).populate(populatequery).sort({ createdAt: -1 });;
      const totalpaymentdetails = await Payment.find(query).countDocuments();
      return { paymentdetails, totalpaymentdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function readallpaymentaggregate(input:any) {
    try{
    return await Payment.aggregate(input);
    }
    catch(e:any){
      throw new Error(configuration.error.erroruserread);
    
    }
    }
  export async function createpayment(input:any){
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
    const transaction = await Payment.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!transaction) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return transaction;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  //update  appointment by query
  export async function updatepaymentbyquery(query:any, reqbody:any){
    try{
    const payment = await Payment.updateMany(query, reqbody,{
      new: true
    });
      if (!payment) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return payment;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  