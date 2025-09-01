import Payment from "../models/payment";
import { paymentinterface } from '../models/payment'
import configuration from "../config";



export async function readpaymentaggregate(input: any) {
  try {
    return await Payment.aggregate(input);
  }
  catch (e: any) {
    console.log(e);
    throw new Error("Failed to update payment");
  }
}
export async function readpaymentaggregateoptimized(input: any, page: any, size: any) {
  try {
    const skip = (page - 1) * size;
    const paymentdetails = await Payment.aggregate(input).skip(skip).limit(size).sort({ createdAt: -1 });
    const totalpaymentdetails = (await Payment.aggregate(input)).length;
    const totalPages = Math.ceil(totalpaymentdetails / size);
    return { paymentdetails, totalPages, totalpaymentdetails, size, page };
  }
  catch (e: any) {
    console.log(e);
    throw new Error("Failed to update payment");
  }
}

//read all payment history
export async function readallpayment(query: any, populatequery: any) {
  try {

    const paymentdetails = await Payment.find(query).populate(populatequery).sort({ createdAt: -1,paymentcategory: 1 });
    const totalpaymentdetails = await Payment.find(query).countDocuments();
    return { paymentdetails, totalpaymentdetails };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to retrieve payment data");
  }
};
export async function readallpaymentaggregate(input: any) {
  try {
    return await Payment.aggregate(input);
  }
  catch (e: any) {
    throw new Error("Failed to retrieve payment data");

  }
}
export async function createpayment(input: any) {
  try {
    const user = new Payment(input);
    return await user.save();
  }
  catch (err) {
    console.log(err);
    throw new Error("Failed to create payment");

  }
}
export async function createpaymentSession(input: any, session: any) {
  try {
    const payment = new Payment(input);
    return await payment.save({ session });
  }
  catch (err) {
    console.log(err);
    throw new Error("Failed to create payment");

  }
}
//find one
export async function readonepayment(query: any) {
  try {
    return await Payment.findOne(query);
  }
  catch (err) {
    console.log(err);
    throw new Error("Failed to retrieve payment data");

  }
}



//update  users
export async function updatepayment(id: any, reqbody: any) {
  try {
    const transaction = await Payment.findOneAndUpdate({ _id: id }, reqbody, 
    //  { new: true}
    { returnDocument: 'after' }
    );
    if (!transaction) {
      //return json  false response
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return transaction;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update payment");

  }

}
//update  appointment by query
export async function updatepaymentbyquery(query: any, reqbody: any) {
  try {
    const payment = await Payment.updateMany(query, reqbody, 
     // {new: true}
     {
      returnDocument: 'after'  // correct option here
    }
    );
    if (!payment) {
      //return json  false response
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    return payment;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update payment");

  }

}
