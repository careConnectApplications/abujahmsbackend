import  mongoose from 'mongoose';
import {validateinputfaulsyvalue,calculateAmountPaidByHMO} from "../../utils/otherservices";
import configuration from "../../config";
import {readoneprice,updateprice} from "../../dao/price";
import {readonepatient,updatepatient} from "../../dao/patientmanagement";
import {readonepayment} from "../../dao/payment";
import { createprescription,readallprescription,readoneprescription,updateprescription,readprescriptionaggregate,optimizedreadprescriptionaggregate } from "../../dao/prescription";
import {readoneappointment, updateappointment} from "../../dao/appointment";
import {readoneadmission} from  "../../dao/admissions";
import {readonehmocategorycover} from "../../dao/hmocategorycover";
import {PharmacyOrderConfirmationContext,PharmacyOrderStrategy,createPrescriptionRecord,selectPharmacyOrderStrategy} from "./pharmacy.helper";

const { ObjectId } = mongoose.Types;

//pharmacy order
export var pharmacyorder= async (req:any, res:any) =>{
    try{
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
      var patient:any = await readonepatient({_id:id,status:configuration.status[1]},{},'','');
      
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
        let {dosageform,strength,dosage,frequency,route,drug,pharmacy,prescriptionnote,duration} = products[i];
      var prescriptionrecord:any = await createprescription({isHMOCover:patient?.isHMOCover,HMOPlan:patient?.HMOPlan,HMOName:patient?.HMOName,HMOId:patient?.HMOId,firstName:patient?.firstName,lastName:patient?.lastName,MRN:patient?.MRN,pharmacy,duration,dosageform,strength,dosage,frequency,route, prescription:drug,patient:patient._id,orderid,prescribersname:firstName + " " + lastName,prescriptionnote,appointment:appointment._id,appointmentid:appointment.appointmentid,appointmentdate:appointment?.appointmentdate,clinic:appointment?.clinic});
      pharcyorderid.push(prescriptionrecord ._id);
      //paymentids.push(createpaymentqueryresult._id);
      }
      
      
      
      //var queryresult=await updatepatient(patient._id,{$push: {prescription:pharcyorderid,payment:paymentids}});
      var queryresult=await updatepatient(patient._id,{$push: {prescription:pharcyorderid}});
      //update appointment with pharmacy orders
      if(appointmentid){
        await updateappointment(appointment._id,{$push: {prescription:pharcyorderid}});

      }
     
      res.status(200).json({queryresult, status: true});
    }
    
    catch(error:any){
      res.status(403).json({ status: false, msg: error.message });
  
    }
  
  }
  //get price of drug
  export async function readdrugprice(req: any, res: any) {
    //
    try {
      const {id} = req.params;
      console.log(req.body);
      const {drug,pharmacy,qty} = req.body;
      console.log("drug", drug);
      validateinputfaulsyvalue({drug,pharmacy,qty});
      var patient = await readonepatient({_id:id,status:configuration.status[1]},{},'','');
    
      if(!patient){
        throw new Error(`Patient donot ${configuration.error.erroralreadyexit} or has not made payment for registration`);
  
      }
      var orderPrice:any = await readoneprice({servicetype:drug, servicecategory: configuration.category[1],pharmacy});
     
      if(!orderPrice){
        throw new Error(`${configuration.error.errornopriceset} ${drug}`);
    }
    var amount =patient.isHMOCover == configuration.ishmo[1]?Number(orderPrice.amount) * configuration.hmodrugpayment * qty:Number(orderPrice.amount) * qty;
    
        
      
     
      res.json({
        queryresult:amount,
        status: true,
      });
    } catch (e: any) {
      console.log(e);
      res.status(403).json({status: false, msg:e.message});
    }
  }

export const pharmacyorderwithoutconfirmation = async (req: any, res: any) => {
  try {
    const { firstName, lastName } = (req.user).user;
    const { id } = req.params;
    var { products} = req.body;
    var orderid: any = String(Date.now());
    var pharcyorderid: any[] = [];
    validateinputfaulsyvalue({ id, products });
    const patient: any = await readonepatient(
      { _id: id, status: configuration.status[1] },
      {},
      "insurance",
      ""
    );

    if (!patient) {
      throw new Error(
        `Patient donot ${configuration.error.erroralreadyexit} or has not made payment for registration`
      );
    }

    const appointment: any = {
      _id: id,
      appointmentid: String(Date.now()),
    };

    for (let i = 0; i < products.length; i++) {
      const {
        dosageform,
        strength,
        dosage,
        frequency,
        route,
        drug,
        pharmacy,
        prescriptionnote,
        qty,
      } = products[i];

      validateinputfaulsyvalue({ qty });

      // get order price
      const orderPrice: any = await readoneprice({
        servicetype: drug,
        servicecategory: configuration.category[1],
        pharmacy,
      });
      if (!orderPrice) {
        throw new Error(`${configuration.error.errornopriceset} ${drug}`);
      }

      // get HMO coverage
      const insurance: any = await readonehmocategorycover(
        { hmoId: patient?.insurance?._id, category: configuration.category[1] },
        { hmopercentagecover: 1 }
      );
      const hmopercentagecover = insurance?.hmopercentagecover ?? 0;

      // create prescription
      const { prescription, actualcost, amount } = await createPrescriptionRecord({
        patient,
        appointment,
        orderPrice,
        qty,
        drug,
        pharmacy,
        dosageform,
        strength,
        dosage,
        frequency,
        route,
        prescriptionnote,
        firstName,
        lastName,
        hmopercentagecover,
        orderid,
      });

      pharcyorderid.push(prescription._id);

      // choose strategy
      const strategy = selectPharmacyOrderStrategy(patient);
      const context = PharmacyOrderConfirmationContext(strategy);
      // execute strategy
      await context.execute({
        id: prescription._id,
        option:true,
        remark:"from pharmacy order without confirmation",
        qty,
        prescriptionresponse: prescription,
        orderPrice,
        patient,
        orderid,
        hmopercentagecover,
        actualcost,
        pharmacy,
        amount,
      });
    }

    // update patient prescriptions
    const queryresult = await updatepatient(patient._id, {
      $push: { prescription: pharcyorderid },
    });

    res.status(200).json({ queryresult, status: true });
  } catch (error: any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};


//pharmacy order
/* 
export var pharmacyorderwithoutconfirmation= async (req:any, res:any) =>{
  try{
   
    const { firstName,lastName} = (req.user).user;
    //accept _id from request
    const {id} = req.params;
    var {products} = req.body;
    var orderid:any=String(Date.now());
    var pharcyorderid =[];
    //var paymentids =[];
      validateinputfaulsyvalue({id, products});
    //search patient
    var patient:any = await readonepatient({_id:id,status:configuration.status[1]},{},'insurance','');
    
    if(!patient){
      throw new Error(`Patient donot ${configuration.error.erroralreadyexit} or has not made payment for registration`);

    }
  var appointment:any={
      _id:id,
      appointmentid:String(Date.now())
      
    };
  
    //loop through all test and create record in lab order
    for(var i =0; i < products.length; i++){
      let {dosageform,strength,dosage,frequency,route,drug,pharmacy,prescriptionnote,duration,qty} = products[i];
      validateinputfaulsyvalue({qty});
      //    console.log(testname[i]);
      //var orderPrice:any = await readoneprice({servicetype:products[i], servicecategory: configuration.category[1],pharmacy});
          var orderPrice:any = await readoneprice({servicetype:drug, servicecategory: configuration.category[1],pharmacy});
     
      if(!orderPrice){
        throw new Error(`${configuration.error.errornopriceset} ${drug}`);
    }
    let insurance:any = await readonehmocategorycover({hmoId:patient?.insurance?._id, category:configuration.category[1]},{hmopercentagecover:1});
    var hmopercentagecover=insurance?.hmopercentagecover ?? 0;
    var amount =calculateAmountPaidByHMO(Number(hmopercentagecover), Number(orderPrice.amount)) * qty;

    //var amount =patient.isHMOCover == configuration.ishmo[1]?Number(orderPrice.amount) * configuration.hmodrugpayment * qty:Number(orderPrice.amount) * qty;
    /*
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
   
    var createpaymentqueryresult =await createpayment({firstName:patient?.firstName,lastName:patient?.lastName,MRN:patient?.MRN,phoneNumber:patient?.phoneNumber,paymentreference,paymentype:drug,paymentcategory:pharmacy,patient:patient._id,amount,qty});
    */
   
      
    //create 
   // console.log("got here");
   /*
    var prescriptionrecord:any = await createprescription({hmopercentagecover,actualcost:Number(orderPrice.amount) * qty,isHMOCover:patient?.isHMOCover,HMOPlan:patient?.HMOPlan,HMOName:patient?.HMOName,HMOId:patient?.HMOId,firstName:patient?.firstName,lastName:patient?.lastName,MRN:patient?.MRN,dispensestatus:configuration.otherstatus[0],amount,qty,pharmacy,duration,dosageform,strength,dosage,frequency,route, prescription:drug,patient:patient._id,orderid,prescribersname:firstName + " " + lastName,prescriptionnote,appointment:appointment._id,appointmentid:appointment.appointmentid,appointmentdate:appointment?.appointmentdate,clinic:appointment?.clinic});
    pharcyorderid.push(prescriptionrecord ._id);
    //paymentids.push(createpaymentqueryresult._id);
    }
    var queryresult=await updatepatient(patient._id,{$push: {prescription:pharcyorderid}});
    res.status(200).json({queryresult, status: true});
  }
  
  catch(error:any){
    res.status(403).json({ status: false, msg: error.message });

  }

}
*/
  export async function readpharmacybyorderid(req: any, res: any) {
    //
    try {
      const { orderid } = req.params;
      console.log(orderid);
      //validate ticket id
      validateinputfaulsyvalue({
        orderid,
     
      });
        
      
      const queryresult = await readallprescription({orderid},{},'patient','appointment','payment');
      res.json({
        queryresult,
        status: true,
      });
    } catch (e: any) {
      console.log(e);
      res.status(403).json({status: false, msg:e.message});
    }
  }

  export async function groupreadallpharmacytransaction(req: any, res: any) {
    try {
      const { clinic} = (req.user).user;
      const query ={pharmacy:clinic};
      const ordergroup = [
       //look up patient
       {
        $match:query
      },

       {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $lookup: {
          from: "appointments",
          localField: "appointment",
          foreignField: "_id",
          as: "appointment",
        },
      },
      {
        $unwind: {
          path: "$appointment",
          preserveNullAndEmptyArrays: true
        }
        
      },
      
      {
        $unwind: {
          path: "$patient",
          preserveNullAndEmptyArrays: true
        }
        
      },
      
        {
          $group: {
            _id: "$orderid",
            orderid: {$first: "$orderid"},
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            prescribersname: { $first: "$prescribersname" },
            firstName:{$first: "$patient.firstName"},
            lastName:{$first: "$patient.lastName"},
            MRN:{$first: "$patient.MRN"},
            isHMOCover:{$first: "$patient.isHMOCover"},
            HMOName:{$first: "$patient.HMOName"},
            HMOId:{$first: "$patient.HMOId"},
            HMOPlan:{$first: "$patient.HMOPlan"},
            appointmentdate:{$first: "$appointment.appointmentdate"},
            clinic:{$first: "$appointment.clinic"},
            appointmentid:{$first: "$appointmentid"}   
          },
        },
        {
          $project:{
            _id:0,
            orderid: 1,
            createdAt: 1,
            updatedAt: 1,
            prescribersname: 1,
            firstName:1,
            lastName:1,
            MRN:1,
            isHMOCover:1,
            HMOName:1,
            HMOId:1,
            HMOPlan:1,
            appointmentdate:1,
            clinic:1,
            appointmentid:1   
          }
        },
        
        { $sort: { createdAt: -1 } },
        
        
      ];
  
      const queryresult = await readprescriptionaggregate(ordergroup);
      res.json({
        queryresult,
        status: true,
      });
  
      
    } catch (e: any) {
      console.log(e);
      res.status(403).json({status: false, msg:e.message});
    }
  }



//awaiting confirmation configuration.status[14]
//pending configuration.status[10]
//dispense configuration.status[6]
//dispense
  export async function groupreadallpharmacytransactionoptimized(req: any, res: any) {
    try {
      console.log('/////query//', req.query);
     
      const { clinic} = (req.user).user;
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 150;

      var status;
      if(req.query.status == "pending"){
        status=configuration.status[10];

      }
      else if(req.query.status == "confirmation"){
        console.log("in confirmation");
        status=configuration.status[14];

      }
      else if(req.query.status == "dispense"){
        status=configuration.status[6];

      }
      else{
        status=configuration.status[10];
      }
      
      //const size = parseInt(req.query.size) || 150;
      const { firstName,MRN,HMOId,lastName,orderid } = req.query;  // Get query parameters from the request
       // Add filters based on query parameters
  
    let matchPosts:any = firstName ? { firstName: new RegExp(firstName, 'i') } :MRN ? { MRN: new RegExp(MRN, 'i') }:HMOId ? { HMOId: new RegExp(HMOId, 'i') }: lastName ? { lastName: new RegExp(lastName, 'i') }:orderid ? { orderid: new RegExp(orderid, 'i') }:{}; // Case-insensitive search
    //const matchPosts = MRN ? { 'patient.MRN': new RegExp(MRN, 'i') } : {}; // Case-insensitive search 
   console.log('matchpost', matchPosts);
   console.log('clinic', clinic);
    //const query ={pharmacy:clinic,dispensestatus:status};
    matchPosts.pharmacy=clinic;
    matchPosts.dispensestatus=status;

    //console.log("query", query);
      const ordergroup = [
       //look up patient
       /*
       {
        $match:query
      },
      */
       {
          $match:matchPosts
        },
/*
       {
        $lookup: {
          from: "patientsmanagements",
          localField: "patient",
          foreignField: "_id",
          as: "patient",
        },
      },
      {
        $lookup: {
          from: "appointments",
          localField: "appointment",
          foreignField: "_id",
          as: "appointment",
        },
      },
      {
        $unwind: {
          path: "$appointment",
          preserveNullAndEmptyArrays: true
        }
        
      },
      
      {
        $unwind: {
          path: "$patient",
          preserveNullAndEmptyArrays: true
        }
        
      },
      */
      
        {
          $group: {
            _id: "$orderid",
            orderid: {$first: "$orderid"},
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            prescribersname: { $first: "$prescribersname" },
            firstName:{$first: "$firstName"},
            lastName:{$first: "$lastName"},
            MRN:{$first: "$MRN"},
            isHMOCover:{$first: "$isHMOCover"},
            HMOName:{$first: "$HMOName"},
            HMOId:{$first: "$HMOId"},
            HMOPlan:{$first: "$HMOPlan"},
            appointmentdate:{$first: "$appointmentdate"},
            clinic:{$first: "$clinic"},
            appointmentid:{$first: "$appointmentid"}   
          },
          
        },
       
        {
          $project:{
            _id:0,
            orderid: 1,
            createdAt: 1,
            updatedAt: 1,
            prescribersname: 1,
            firstName:1,
            lastName:1,
            MRN:1,
            isHMOCover:1,
            HMOName:1,
            HMOId:1,
            HMOPlan:1,
            appointmentdate:1,
            clinic:1,
            appointmentid:1   
          }
        },
        
        { $sort: { createdAt: -1 } },
        
        
      ];
  
      const queryresult = await optimizedreadprescriptionaggregate(ordergroup,page,size);
      res.json({
        queryresult,
        status: true,
      });
  
      
    } catch (e: any) {
      console.log(e);
      res.status(403).json({status: false, msg:e.message});
    }
  }


  //get all pharmacy orderf
  export const readallpharmacytransaction = async (req:any, res:any) => {
      try {
       //extract staff department
       const 
       
       { clinic} = (req.user).user;
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

 // ✅ Functional Component Controller
 
export const confirmpharmacygrouporder = async (req: any, res: any) => {
  try {
    const { pharmacyrequest } = req.body;
    let queryresult;

    for (let i = 0; pharmacyrequest.length > i; i++) {
      const { option, remark, qty, id } = pharmacyrequest[i];

      if (option == true) {
        validateinputfaulsyvalue({ qty });
      }

      const prescriptionresponse: any = await readoneprescription(
        { _id: new ObjectId(id) },
        {},
        "patient",
        "",
        ""
      );
        if (!prescriptionresponse) {
      throw new Error("Prescription not found or already processed.");
    }
    
    if (!prescriptionresponse.dispensestatus || prescriptionresponse.dispensestatus !== configuration.status[14]) {
      throw new Error("Prescription is not in a valid state for confirmation.");
    } 

      const { prescription, orderid, patient, pharmacy } = prescriptionresponse;

      const orderPrice: any = await readoneprice({
        servicetype: prescription,
        servicecategory: configuration.category[1],
        pharmacy,
      });

      if (!orderPrice || orderPrice.amount == null) {
        throw new Error(`${configuration.error.errornopriceset} ${prescription}`);
      }

      const insurance: any = await readonehmocategorycover(
        { hmoId: patient.insurance, category: configuration.category[1] },
        { hmopercentagecover: 1 }
      );

      const hmopercentagecover = insurance?.hmopercentagecover ?? 0;
      const amount =
        calculateAmountPaidByHMO(Number(hmopercentagecover), Number(orderPrice.amount)) * qty;

      // pick strategy
      let strategy: PharmacyOrderStrategy=selectPharmacyOrderStrategy(patient);
      const context = PharmacyOrderConfirmationContext(strategy);
      queryresult = await context.execute({
      id,
      option,
      remark,
      qty,
      prescriptionresponse,
      orderPrice,
      patient,
      orderid,
      pharmacy,
      amount,
      hmopercentagecover,
      actualcost: Number(orderPrice.amount) * qty
    })
    }

    res.status(200).json({ queryresult, status: true });
  } catch (e: any) {
    console.log("error", e);
    res.status(403).json({ status: false, msg: e.message });
  }
};

export const confirmpharmacyorder = async (req: any, res: any) => {
  try {
    const { option, remark, qty } = req.body;
    const { id } = req.params;
    if (option == true) {
      validateinputfaulsyvalue({ qty });
    }

    // fetch prescription
    const prescriptionresponse: any = await readoneprescription(
      { _id: id },
      {},
      "patient",
      "",
      ""
    );
    
    if (!prescriptionresponse) {
      throw new Error("Prescription not found or already processed.");
    }
    
    if (!prescriptionresponse.dispensestatus || prescriptionresponse.dispensestatus !== configuration.status[14]) {
      throw new Error("Prescription is not in a valid state for confirmation.");
    } 

    const { prescription, orderid, patient, pharmacy } = prescriptionresponse;
    // get price
    const orderPrice: any = await readoneprice({
      servicetype: prescription,
      servicecategory: configuration.category[1],
      pharmacy,
    });
   

    if (!orderPrice) {
      throw new Error(
        `${configuration.error.errornopriceset} ${prescription}`
      );
    }

    // insurance cover
    const insurance: any = await readonehmocategorycover(
      { hmoId: patient?.insurance, category: configuration.category[1] },
      { hmopercentagecover: 1 }
    );

    const hmopercentagecover = insurance?.hmopercentagecover ?? 0;
    const amount =
      calculateAmountPaidByHMO(Number(hmopercentagecover), Number(orderPrice.amount)) *
      qty;

    // pick strategy
    let strategy: PharmacyOrderStrategy=selectPharmacyOrderStrategy(patient);
    /*
    if (!(patient.isHMOCover == configuration.ishmo[1] || patient.isHMOCover == true)) {
      strategy = SelfPayPharmacyOrderStrategy;
    } else {
      strategy = HMOPharmacyOrderStrategy;
    }
      */

    // run context
    const context = PharmacyOrderConfirmationContext(strategy);
    const queryresult = await context.execute({
      id,
      option,
      remark,
      qty,
      prescriptionresponse,
      orderPrice,
      patient,
      orderid,
      pharmacy,
      amount,
      hmopercentagecover,
      actualcost: Number(orderPrice.amount) * qty
    });

    res.status(200).json({ queryresult, status: true });
  } catch (e: any) {
    console.log("error", e);
    res.status(403).json({ status: false, msg: e.message });
  }
};




    //get all pharmacy order
  export const dispense = async (req:any, res:any) => {
    try {
    const {id} = req.params;
       //dispense
    //search product in inventory
    var response:any = await readoneprescription({_id:id},{},'patient','','');

    const {dispensestatus,patient,pharmacy} = response;
    //check product status
    if(dispensestatus !== configuration.status[10]){
      throw new Error(`Dispense ${configuration.error.errortasknotpending}`);

    }
    //check payment status
    var  findAdmission = await readoneadmission({patient:patient._id, status:{$ne: configuration.admissionstatus[5]}},{},'');
    if(!findAdmission){
    var paymentrecord:any = await readonepayment({_id:response.payment});
    if(paymentrecord.status !== configuration.status[3]){
      throw new Error(configuration.error.errorpayment);

    }  }
   // console.log(testname[i]);
  var orderPrice:any = await readoneprice({servicetype:response.prescription, servicecategory: configuration.category[1],pharmacy});  
  console.log('orderprice', orderPrice);
  if(!orderPrice){
      throw new Error(configuration.error.errornopriceset);
  }
  /*
  if(!orderPrice.qty || orderPrice.qty <=0){
    throw new Error(`${response.prescription} ${configuration.error.erroravailability} or qty not defined in inventory`);

  }
    */
  //reduce the quantity
let {qty}= await updateprice({_id:orderPrice._id},{qty:Number(orderPrice.qty) - Number(response.qty)});

//change status 6
var queryresult=await updateprescription(response._id,{ dispensestatus: configuration.status[6],balance:qty});
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
  