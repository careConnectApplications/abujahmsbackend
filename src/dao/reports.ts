import Payment from "../models/payment";
export async function readpaymentaggregate(input:any) {
    try{
    return await Payment.aggregate(input);
    }
    catch(e:any){
      console.log(e);
      //throw new Error(configuration.error.erroruserupdate);
    }
    }