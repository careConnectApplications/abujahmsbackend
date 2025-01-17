import {validateinputfaulsyvalue} from "../../utils/otherservices";
import configuration from "../../config";
import {readoneprice} from "../../dao/price";
import {readonepatient,updatepatient} from "../../dao/patientmanagement";
import {createpayment} from "../../dao/payment";
import { createprescription,readallprescription } from "../../dao/prescription";


//pharmacy order
export var pharmacyorder= async (req:any, res:any) =>{
    try{
      console.log(req.user);
      const { firstName,lastName} = (req.user).user;
      //accept _id from request
      const {id} = req.params;
      const {products,prescriptionnote} = req.body;
      var orderid:any=String(Date.now());
      var pharcyorderid =[];
      var paymentids =[];
      validateinputfaulsyvalue({id, products});
      //search patient
      var patient = await readonepatient({_id:id,status:configuration.status[1]},{},'','');
      if(!patient){
        throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);

      }
      //loop through all test and create record in lab order
      for(var i =0; i < products.length; i++){
    //    console.log(testname[i]);
        var orderPrice:any = await readoneprice({servicetype:products[i], servicecategory: configuration.category[1]});
        console.log(orderPrice);
        if(!orderPrice){
          throw new Error(configuration.error.errornopriceset);
      }
      
      var createpaymentqueryresult =await createpayment({paymentreference:orderid,paymentype:products[i],paymentcategory:configuration.category[1],patient:patient._id,amount:Number(orderPrice.amount)});
      
      //create 
      
      var prescriptionrecord:any = await createprescription({prescription:products[i],patient:patient._id,payment:createpaymentqueryresult._id,orderid,prescribersname:firstName + " " + lastName,prescriptionnote});
      pharcyorderid.push(prescriptionrecord ._id);
      paymentids.push(createpaymentqueryresult._id);
      }
      
      
      var queryresult=await updatepatient(patient._id,{$push: {prescription:pharcyorderid,payment:paymentids}});
      res.status(200).json({queryresult:prescriptionrecord, status: true});
    }
    
    catch(error:any){
      res.status(403).json({ status: false, msg: error.message });
  
    }
  
  }

  //get all pharmacy order
  export const readallpharmacytransaction = async (req:any, res:any) => {
      try {
        const queryresult = await readallprescription({},{},'patient','appointment','payment');
        res.status(200).json({
          queryresult,
          status:true
        }); 
      } catch (error:any) {
        res.status(403).json({ status: false, msg: error.message });
      }
    };

    //dispense
    