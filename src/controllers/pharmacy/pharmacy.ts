import  mongoose from 'mongoose';
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import configuration from "../../config";
import {readoneprice,updateprice} from "../../dao/price";
import {readonepatient,updatepatient} from "../../dao/patientmanagement";
import {createpayment,readonepayment} from "../../dao/payment";
import { createprescription,readallprescription,readoneprescription,updateprescription } from "../../dao/prescription";
import {readoneappointment} from "../../dao/appointment";
const { ObjectId } = mongoose.Types;

//pharmacy order
export var pharmacyorder= async (req:any, res:any) =>{
    try{
      console.log(req.user);
      const { firstName,lastName} = (req.user).user;
      //accept _id from request
      const {id} = req.params;
      var {products,prescriptionnote, pharmacy,appointmentid} = req.body;
      var orderid:any=String(Date.now());
      var pharcyorderid =[];
      var paymentids =[];
      validateinputfaulsyvalue({id, products,pharmacy});
      //search patient
      var patient = await readonepatient({_id:id,status:configuration.status[1]},{},'','');
      
      if(!patient){
        throw new Error(`Patient donot ${configuration.error.erroralreadyexit} or has not made payment for registration`);

      }
      var appointment:any;
    if(appointmentid){
      appointmentid = new ObjectId(appointmentid);
      appointment = await readoneappointment({_id:appointmentid},{},'');
            if(!appointment){
              //create an appointment
              throw new Error(`Appointment donot ${configuration.error.erroralreadyexit}`);

          }


    }
    else{
      appointment={
        _id:id,
        appointmentid:"noneappoinment"
        
      }
    }
    
      //loop through all test and create record in lab order
      for(var i =0; i < products.length; i++){
    //    console.log(testname[i]);
        var orderPrice:any = await readoneprice({servicetype:products[i], servicecategory: configuration.category[1],pharmacy});
        
        if(!orderPrice){
          throw new Error(configuration.error.errornopriceset);
      }
      if(orderPrice.qty <=0){
        throw new Error(`${products[i]} ${configuration.error.erroravailability}`);

      }
      
      var createpaymentqueryresult =await createpayment({paymentreference:orderid,paymentype:products[i],paymentcategory:configuration.category[1],patient:patient._id,amount:Number(orderPrice.amount)});
      
      //create 
      console.log("got here");
      var prescriptionrecord:any = await createprescription({pharmacy, prescription:products[i],patient:patient._id,payment:createpaymentqueryresult._id,orderid,prescribersname:firstName + " " + lastName,prescriptionnote,appointment:appointment._id,appointmentid:appointment.appointmentid});
      console.log(prescriptionrecord);
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
       //extract staff department
       const { clinic} = (req.user).user;
        const queryresult = await readallprescription({pharmacy:clinic},{},'patient','appointment','payment');
        res.status(200).json({
          queryresult,
          status:true
        }); 
      } catch (error:any) {
        res.status(403).json({ status: false, msg: error.message });
      }
    };

    //get all pharmacy order
  export const dispense = async (req:any, res:any) => {
    try {
    const {id} = req.params;
       //dispense
    //search product in inventory
    var response:any = await readoneprescription({_id:id},{},'','','');
    console.log('response', response);
    //check product status
    if(response.dispensestatus !== configuration.status[10]){
      throw new Error(`Dispense ${configuration.error.errortasknotpending}`);

    }
    //check payment status
    var paymentrecord:any = await readonepayment({_id:response.payment});
   
    if(paymentrecord.status !== configuration.status[3]){
      throw new Error(configuration.error.errorpayment);

    }
   // console.log(testname[i]);
  var orderPrice:any = await readoneprice({servicetype:response.prescription, servicecategory: configuration.category[1]});  
  if(!orderPrice){
      throw new Error(configuration.error.errornopriceset);
  }
  if(orderPrice.qty <=0){
    throw new Error(`${response.prescription} ${configuration.error.erroravailability}`);

  }
  //reduce the quantity
await updateprice({_id:orderPrice._id},{qty:Number(orderPrice.qty) - 1});
//change status 6
var queryresult=await updateprescription({_id:response._id},{ dispensestatus: configuration.status[6]});
res.status(200).json({queryresult, status: true});

    
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };

   