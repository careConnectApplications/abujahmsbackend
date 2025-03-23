import  mongoose from 'mongoose';
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import configuration from "../../config";
import {readoneprice,updateprice} from "../../dao/price";
import {readonepatient,updatepatient} from "../../dao/patientmanagement";
import {createpayment,readonepayment} from "../../dao/payment";
import { createprescription,readallprescription,readoneprescription,updateprescription } from "../../dao/prescription";
import {readoneappointment} from "../../dao/appointment";
import {readoneadmission} from  "../../dao/admissions";

const { ObjectId } = mongoose.Types;

//pharmacy order
export var pharmacyorder= async (req:any, res:any) =>{
    try{
      //add more options  dosageform,strength,dosage,frequency
      //remove  payment from this 
      //add qty to the data base

/*

dosageform:String,
  strength:String,
  dosage:String,
  frequency:String,
  route:String,
*/
      

      console.log(req.user);
      const { firstName,lastName} = (req.user).user;
      //accept _id from request
      const {id} = req.params;
      var {products, appointmentid} = req.body;
      var orderid:any=String(Date.now());
      var pharcyorderid =[];
      //var paymentids =[];
     // validateinputfaulsyvalue({id, products,pharmacy});
        validateinputfaulsyvalue({id, products});
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
        appointmentid:String(Date.now())
        
      }
    }
    
      //loop through all test and create record in lab order
      for(var i =0; i < products.length; i++){
        let {dosageform,strength,dosage,frequency,route,drug,pharmacy,prescriptionnote} = products[i];
    //    console.log(testname[i]);
        //var orderPrice:any = await readoneprice({servicetype:products[i], servicecategory: configuration.category[1],pharmacy});
        /*
        var orderPrice:any = await readoneprice({servicetype:drug, servicecategory: configuration.category[1],pharmacy});
        
        if(!orderPrice){
          throw new Error(`${configuration.error.errornopriceset} ${products[i]}`);
      }
      if(orderPrice.qty <=0){
        throw new Error(`${products[i]} ${configuration.error.erroravailability}`);

      }
        */
      /*
      var amount =patient.isHMOCover == configuration.ishmo[1]?Number(orderPrice.amount) * configuration.hmodrugpayment:Number(orderPrice.amount);
      var createpaymentqueryresult =await createpayment({paymentreference:orderid,paymentype:products[i],paymentcategory:configuration.category[1],patient:patient._id,amount});
      */
      //create 
      console.log("got here");
      //var prescriptionrecord:any = await createprescription({pharmacy, prescription:products[i],patient:patient._id,payment:createpaymentqueryresult._id,orderid,prescribersname:firstName + " " + lastName,prescriptionnote,appointment:appointment._id,appointmentid:appointment.appointmentid});
      var prescriptionrecord:any = await createprescription({pharmacy,dosageform,strength,dosage,frequency,route, prescription:drug,patient:patient._id,orderid,prescribersname:firstName + " " + lastName,prescriptionnote,appointment:appointment._id,appointmentid:appointment.appointmentid});
      console.log(prescriptionrecord);
      pharcyorderid.push(prescriptionrecord ._id);
      //paymentids.push(createpaymentqueryresult._id);
      }
      
      
      
      //var queryresult=await updatepatient(patient._id,{$push: {prescription:pharcyorderid,payment:paymentids}});
      var queryresult=await updatepatient(patient._id,{$push: {prescription:pharcyorderid}});
      res.status(200).json({queryresult, status: true});
    }
    
    catch(error:any){
      res.status(403).json({ status: false, msg: error.message });
  
    }
  
  }

  //get all pharmacy orderf
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
 export const readallpharmacytransactionbypartient = async (req:any, res:any) => {
  try {

   const {patient} = req.params;
    const queryresult = await readallprescription({patient},{},'patient','appointment','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};

export const confirmpharmacyorder = async (req:any, res:any) =>{
  try{
    //extract option
    const {option,remark, qty} = req.body;
    if(option == true){
    validateinputfaulsyvalue({qty});
    }
    const {id} = req.params;
  //search for the lab request
  var prescriptionresponse:any = await readoneprescription({_id:id},{},'patient','','');
  const {prescription, orderid,patient,pharmacy} = prescriptionresponse;
  
  //get amount 
  var orderPrice:any = await readoneprice({servicetype:prescription, servicecategory: configuration.category[1],pharmacy});
        
  if(!orderPrice){
    throw new Error(`${configuration.error.errornopriceset} ${prescription}`);
}
if(orderPrice.qty <=0){
  throw new Error(`${prescription} ${configuration.error.erroravailability}`);

}
//validate quantity entered




var amount =patient.isHMOCover == configuration.ishmo[1]?Number(orderPrice.amount) * configuration.hmodrugpayment * qty:Number(orderPrice.amount) * qty;
let paymentreference; 
//validate the status
  //search for patient under admission. if the patient is admitted the patient admission number will be use as payment reference
  var  findAdmission = await readoneadmission({patient:patient._id, status:{$ne: configuration.admissionstatus[5]}},{},'');
  if(findAdmission){
    paymentreference = findAdmission.admissionid;

}
else{
  paymentreference = orderid;
}
  let queryresult;
  if(option == true){
    var createpaymentqueryresult =await createpayment({paymentreference,paymentype:prescription,paymentcategory:configuration.category[1],patient:patient._id,amount,qty});
  queryresult= await updateprescription(id,{dispensestatus:configuration.status[10],payment:createpaymentqueryresult._id,remark,qty});
    await updatepatient(patient._id,{$push: {payment:createpaymentqueryresult._id}});
    
  }
  else{
    queryresult= await updateprescription(id,{dispensestatus:configuration.status[13], remark});

  }
  res.status(200).json({queryresult, status: true});
    //if accept
//accept or reject lab order
//var createpaymentqueryresult =await createpayment({paymentreference:id,paymentype:testname[i],paymentcategory:testsetting[0].category,patient:appointment.patient,amount:Number(testPrice.amount)})
//paymentids.push(createpaymentqueryresult._id);
//var queryresult=await updatepatient(appointment.patient,{$push: {payment:paymentids}});
//var testrecord = await createlab({payment:createpaymentqueryresult._id});
//change status to 2 or  13 for reject

  }
  catch(e:any){
    console.log("error", e);
    res.status(403).json({ status: false, msg: e.message });

  }
    
}


    //get all pharmacy order
  export const dispense = async (req:any, res:any) => {
    try {
    const {id} = req.params;
       //dispense
    //search product in inventory
    var response:any = await readoneprescription({_id:id},{},'patient','','');
    const {dispensestatus,patient} = response;
    //check product status
    if(dispensestatus !== configuration.status[10]){
      throw new Error(`Dispense ${configuration.error.errortasknotpending}`);

    }
    //check payment status
    var  findAdmission = await readoneadmission({patient:patient._id, status:{$ne: configuration.admissionstatus[5]}},{},'');
    console.log('findAdmission', findAdmission);
    if(!findAdmission){
    var paymentrecord:any = await readonepayment({_id:response.payment});
    if(paymentrecord.status !== configuration.status[3]){
      throw new Error(configuration.error.errorpayment);

    }
  }
   // console.log(testname[i]);
  var orderPrice:any = await readoneprice({servicetype:response.prescription, servicecategory: configuration.category[1]});  
  console.log('orderprice', orderPrice);
  if(!orderPrice){
      throw new Error(configuration.error.errornopriceset);
  }
  if(!orderPrice.qty || orderPrice.qty <=0){
    throw new Error(`${response.prescription} ${configuration.error.erroravailability} or qty not defined in inventory`);

  }
  //reduce the quantity
await updateprice({_id:orderPrice._id},{qty:Number(orderPrice.qty) - Number(response.qty)});
//change status 6
var queryresult=await updateprescription(response._id,{ dispensestatus: configuration.status[6]});
res.status(200).json({queryresult, status: true});

    
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };

   // get price of drug
   export const getpriceofdrug = async (req:any, res:any) =>{
    try{
      
      const {id} = req.params;
     
    //search for the lab request
    var prescriptionresponse:any = await readoneprescription({_id:id},{},'patient','','');
   
    const {prescription,patient,pharmacy} = prescriptionresponse;
    //get amount 
    var orderPrice:any = await readoneprice({servicetype:prescription, servicecategory: configuration.category[1],pharmacy});  
    var amount =patient.isHMOCover == configuration.ishmo[1]?Number(orderPrice.amount) * configuration.hmodrugpayment:Number(orderPrice.amount);
    res.status(200).json({price:amount, status: true});
    }
    catch(e:any){
      console.log("error", e);
      res.status(403).json({ status: false, msg: e.message });
  
    }
      
  }
  