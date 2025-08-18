
import { NextFunction, Request, Response } from "express";
import {optimizedreadallradiology,readallradiology,readoneradiology,updateradiology } from "../../dao/radiology";
import {readallprocedure,readprocedureaggregateoptimized,readoneprocedure,updateprocedure} from "../../dao/procedure";
import {optimizedreadprescriptionaggregate,readallprescription,readoneprescription,updateprescription} from "../../dao/prescription";
import {optimizedreadalllab,readalllab,readonelab,updatelab} from "../../dao/lab";
import {getAllPaginatedHistopathologyRecords,getHistopathologyById} from "../../dao/histopathology.dao";
import { validateinputfaulsyvalue } from "../../utils/otherservices";
import {readoneadmission} from "../../dao/admissions";
import {createpayment} from "../../dao/payment";
import {updatepatient} from "../../dao/patientmanagement";
import {createInsuranceClaim} from "../../dao/insuranceclaim";
import configuration from "../../config";
import {processLab,processRadiology,processProcedure,processPharmacy} from "./insuranceclaimandauthorization.helper";
import catchAsync from "../../utils/catchAsync";
//import status from "http-status";


export const groupreadAwaitingAuthorizationRadiologyoptimized = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    var {  firstName, MRN, HMOId, lastName, phoneNumber, testname} = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const filter: any = {};
    var statusfilter: any = { status:configuration.otherstatus[0] };
    // Add filters based on query parameters
    if (firstName) {
      filter.firstName = new RegExp(firstName, 'i'); // Case-insensitive search for name
    }
    if (MRN) {
      filter.MRN = new RegExp(MRN, 'i');
    }
    if (HMOId) {
      filter.HMOId = new RegExp(HMOId, 'i'); // Case-insensitive search for email
    }
    if (lastName) {
      filter.lastName = new RegExp(lastName, 'i'); // Case-insensitive search for email
    }
    if (phoneNumber) {
      filter.phoneNumber = new RegExp(phoneNumber, 'i'); // Case-insensitive search for email
    }
    let aggregatequery =
      [
        {
          $match: statusfilter
        },
        
        {
          $lookup: {
            from: 'patientsmanagements',
            localField: 'patient',
            foreignField: '_id',
            as: 'patient'
          }
        },
    
        {
          $unwind: {
            path: '$patient',
            preserveNullAndEmptyArrays: true

          }  // Deconstruct the patient array (from the lookup)
        },
        {
            $group: {
              _id: "$testid",
                createdAt: { $first: "$createdAt" },
                testname: { $first: "$testname" },
                testid: { $first: "$testid" },
                department: { $first: "$department" },
                raiseby: { $first: "$raiseby" },
                HMOId: { $first: "$patient.HMOId" },
                HMOName: { $first: "$patient.HMOName" },
                status: { $first: "$status" },
                totalamount: { $sum: "$amount" },
                MRN: { $first: "$patient.MRN" },
                firstName: { $first: "$patient.firstName" },
                lastName: { $first: "$patient.lastName" },
                phoneNumber: { $first: "$patient.phoneNumber" }


            }
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            testid: 1,
            department: 1,
            raiseby: 1,
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            MRN: 1,
            HMOId: 1,
            HMOName: 1,
            totalamount: 1,
            status: 1,
            

          }
        },
        {
          $match: filter
        },
      ];
    const queryresult = await optimizedreadallradiology(aggregatequery, page, size);



    res.status(200).json({
      queryresult,
      status: true
    });




});

//////////////////////procedure ////////////////////////////
export const groupreadAwaitingAuthorizationProcedureoptimized = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

    var {  firstName, MRN, HMOId, lastName, phoneNumber} = req.query;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    const filter: any = {};
    var statusfilter: any = { status:configuration.otherstatus[0] };
    // Add filters based on query parameters
    if (firstName) {
      filter.firstName = new RegExp(firstName, 'i'); // Case-insensitive search for name
    }
    if (MRN) {
      filter.MRN = new RegExp(MRN, 'i');
    }
    if (HMOId) {
      filter.HMOId = new RegExp(HMOId, 'i'); // Case-insensitive search for email
    }
    if (lastName) {
      filter.lastName = new RegExp(lastName, 'i'); // Case-insensitive search for email
    }
    if (phoneNumber) {
      filter.phoneNumber = new RegExp(phoneNumber, 'i'); // Case-insensitive search for email
    }
    let aggregatequery =
      [
        {
          $match: statusfilter
        },
        
        {
          $lookup: {
            from: 'patientsmanagements',
            localField: 'patient',
            foreignField: '_id',
            as: 'patient'
          }
        },
    
        {
          $unwind: {
            path: '$patient',
            preserveNullAndEmptyArrays: true

          }  // Deconstruct the patient array (from the lookup)
        },
        {
            $group: {
              _id: "$procedureid",
                createdAt: { $first: "$createdAt" },
                procedure: { $first: "$procedure" },
                procedureid: { $first: "$procedureid" },
                raiseby: { $first: "$raiseby" },
                HMOId: { $first: "$patient.HMOId" },
                HMOName: { $first: "$patient.HMOName" },
                status: { $first: "$status" },
                totalamount: { $sum: "$amount" },
                MRN: { $first: "$patient.MRN" },
                firstName: { $first: "$patient.firstName" },
                lastName: { $first: "$patient.lastName" },
                phoneNumber: { $first: "$patient.phoneNumber" }


            }
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            procedureid: 1,
            procedure: 1,
            raiseby: 1,
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            MRN: 1,
            HMOId: 1,
            HMOName: 1,
            totalamount: 1,
            status: 1,
            

          }
        },
        {
          $match: filter
        },
      ];
    const queryresult = await readprocedureaggregateoptimized(aggregatequery, page, size);



    res.status(200).json({
      queryresult,
      status: true
    });

});





/////////////////////////pharmaccy /////////////////
export const groupreadawatingauthorizationpharmacytransaction = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
   
      const query ={ dispensestatus:configuration.otherstatus[0] };
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
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
            prescribersname: { $first: "$prescribersname" },
            firstName:{$first: "$patient.firstName"},
            lastName:{$first: "$patient.lastName"},
            MRN:{$first: "$patient.MRN"},
            status: { $first: "$status" },
            totalamount: { $sum: "$amount" },
            phoneNumber:{$first: "$patient.phoneNumber"},
            isHMOCover:{$first: "$patient.isHMOCover"},
            HMOName:{$first: "$patient.HMOName"},
            HMOId:{$first: "$patient.HMOId"},
            HMOPlan:{$first: "$patient.HMOPlan"},
            appointmentid:{$first: "$appointmentid"}   
          },
        },
        {
          $project:{
            _id:0,
            orderid: 1,
            createdAt: 1,
            prescribersname: 1,
            firstName:1,
            lastName:1,
            totalamount:1,
            phoneNumber:1,
            MRN:1,
            isHMOCover:1,
            HMOName:1,
            HMOId:1,
            HMOPlan:1,
            status:1,
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
  
      
   
  })
  //////////////////////////////////lab ///////////////////////
  export const groupreadawatingauthorizationlabtransaction = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

      const query = { status:configuration.otherstatus[0]};
       const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
      const queryresult = await optimizedreadalllab([
         {
         
          $match: query,
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
          $group: {
            _id: "$testid",
            MRN:{$first: {$first:"$patient.MRN"}},
            firstName:{$first: {$first:"$patient.firstName"}},
            lastName:{$first: {$first:"$patient.lastName"}},
            phoneNumber:{$first: {$first:"$patient.phoneNumber"}},
            isHMOCover:{$first: "$patient.isHMOCover"},
            HMOName:{$first: "$patient.HMOName"},
            HMOId:{$first: "$patient.HMOId"},
            HMOPlan:{$first: "$patient.HMOPlan"},
            appointmentid: {$first:"$appointmentid"},
            testid: {$first:"$testid"},
            status: {$first:"$status"},
            totalamount: { $sum: "$amount" },
            createdAt: {$first:"$createdAt"},
            raiseby: {$first:"$raiseby"}
           
            
          },
          
          
        },
        
  
  
        
        { $sort: { createdAt: -1 } },
        
      ],page,size);
     
     
      
  
      res.json({
        queryresult,
        status: true,
      });
   
  });

///////////////////////////////histopathology ///////////////////////
export const readallhistopathologyAwaitingAuthorization = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

     const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 150;
    //const queryresult = await readallhistopathology({department:clinic},{},'patient','appointment','payment');
    const queryresult = await getAllPaginatedHistopathologyRecords({status:configuration.otherstatus[0],page,size});
    res.status(200).json({
      queryresult,
      status:true
    }); 

});
///////////////////////read all by reference id ///////////////////////
export const readallbyreferenceid = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { referencenumber } = req.query;
    const {referencecategory} = req.query;
    let queryresult;

    if(referencecategory == configuration.referencecategory[0] ){
     //lab
     queryresult=await readalllab({testid:referencenumber, status:configuration.otherstatus[0]},{},'patient','appointment','');


    }
    
    else if(referencecategory == configuration.referencecategory[1] ){
//radiology
queryresult=await readallradiology({testid:referencenumber, status:configuration.otherstatus[0]},{},'patient','');
    }
    else if(referencecategory == configuration.referencecategory[2] ){//procedure
        queryresult=await readallprocedure({procedureid:referencenumber, status:configuration.otherstatus[0]},{},'patient','');
          }
          else if(referencecategory == configuration.referencecategory[3] ){//pharmacy
            //pharmacy  
            queryresult=await readallprescription({orderid:referencenumber, dispensestatus:configuration.otherstatus[0]},{},'patient','','');

          }
          else{
            throw new Error( "Invalid reference category");
          }

    res.status(200).json({
      queryresult,
      status:true
    }); 

})

//////////////////////////authorize transaction individually   ///////////////////////
/*
export const authorizeTransaction = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
    const { authorizationCode, approvalCode } = req.body;
    const { id, referencecategory } = req.params;
    const { firstName, lastName } = (req.user).user;
    let createdBy = `${firstName} ${lastName}`;
     validateinputfaulsyvalue({ authorizationCode, approvalCode,referencecategory,id });
     let input:any={};
    // Update the transaction status
    if(referencecategory == configuration.referencecategory[0] ){
     //lab
     var lab:any =await readonelab({_id:id},{},'patient');
     const {testname, testid,patient,amount} = lab;
      let paymentreference; 
  //search for patient under admission. if the patient is admitted the patient admission number will be use as payment reference
  var  findAdmission = await readoneadmission({patient:patient._id, status:{$ne: configuration.admissionstatus[5]}},{},'');
  if(findAdmission){
    paymentreference = findAdmission.admissionid;
}
else{
  paymentreference = testid;
  
}
  
  if(amount > 0){
    var createpaymentqueryresult =await createpayment({firstName:patient?.firstName,lastName:patient?.lastName,MRN:patient?.MRN,phoneNumber:patient?.phoneNumber,paymentreference,paymentype:testname,paymentcategory:configuration.category[2],patient:patient._id,amount});
    await updatelab({_id:id},{status:configuration.status[2],payment:createpaymentqueryresult._id});
    await updatepatient(patient._id,{$push: {payment:createpaymentqueryresult._id}})
    
  }
  else if(amount == 0){
    await updatelab({_id:id},{status:configuration.status[5]});

  }
  //create insurance claim
      input.patient=patient._id;
      input.serviceCategory=configuration.category[2];
      input.lab=lab._id;
      input.authorizationCode=authorizationCode;
      input.approvalCode=approvalCode;
      input.amountClaimed= amount;
      input.amountApproved= amount;
      input.insurer= patient.HMOName;
      input.createdBy=createdBy;   
    }
    
    else if(referencecategory == configuration.referencecategory[1] ){
      //radiology
      var radiology: any = await readoneradiology({ _id: id }, {}, 'patient');
      const { testname, testid, patient, amount } = radiology;
      let paymentreference;
      var findAdmission = await readoneadmission({ patient: patient._id, status: { $ne: configuration.admissionstatus[5] } }, {}, '');
    if (findAdmission) {
      paymentreference = findAdmission.admissionid;

    }
    else {
      paymentreference = testid;
    }
    if (amount > 0) {
          var createpaymentqueryresult = await createpayment({ firstName: patient?.firstName, lastName: patient?.lastName, MRN: patient?.MRN, phoneNumber: patient?.phoneNumber, paymentreference, paymentype: testname, paymentcategory: configuration.category[4], patient, amount });
          await updateradiology({ _id: id }, { status: configuration.status[9], payment: createpaymentqueryresult._id});
          await updatepatient(patient._id, { $push: { payment: createpaymentqueryresult._id } });
    
        }
        else if (amount == 0) {
          await updateradiology({ _id: id }, { status: configuration.status[9]});
    
        }
      input.patient=patient._id;
      input.serviceCategory=configuration.category[4];
      input.radiology=radiology._id;
      input.authorizationCode=authorizationCode;
      input.approvalCode=approvalCode;
      input.amountClaimed= amount;
      input.amountApproved= amount;
      input.insurer= patient.HMOName;
      input.createdBy=createdBy
    }

    else if(referencecategory == configuration.referencecategory[2] ){
      //procedure
      var findprocedure: any = await readoneprocedure({ _id: id }, {}, 'patient');
       const { procedure, procedureid, patient, amount } = findprocedure;
      let paymentreference;
      //search for patient under admission. if the patient is admitted the patient admission number will be use as payment reference
      var findAdmission = await readoneadmission({ patient: patient._id, status: { $ne: configuration.admissionstatus[5] } }, {}, '');
      if (findAdmission) {
        paymentreference = findAdmission.admissionid;

      }
      else {
        paymentreference = procedureid;
      }
              //create payment
      if (amount > 0) {

        var createpaymentqueryresult = await createpayment({ firstName: patient?.firstName, lastName: patient?.lastName, MRN: patient?.MRN, phoneNumber: patient?.phoneNumber, paymentreference, paymentype: procedure,paymentcategory: configuration.category[5], patient: id, amount: Number(amount) });
        await updateprocedure({ _id: id }, { status: configuration.status[9], payment: createpaymentqueryresult._id});
        await updatepatient(patient._id, { $push: { payment: createpaymentqueryresult._id } });
      }
      else {
        //create testrecordn 
        var procedurerecord = await await updateprocedure({ _id: id }, { status: configuration.status[9], });
         await updatepatient(patient._id, { $push: {proceduresid: procedurerecord._id } });
      }

      input.patient=patient._id;
      input.serviceCategory=configuration.category[5];
      input.procedure=findprocedure._id;
      input.authorizationCode=authorizationCode;
      input.approvalCode=approvalCode;
      input.amountClaimed= amount;
      input.amountApproved= amount;
      input.insurer= patient.HMOName;
      input.createdBy=createdBy;
        
    }
    else if(referencecategory == configuration.referencecategory[3] ){
      const findPharmacy:any =await readoneprescription({_id:id},{},'patient','','');
      const { prescription, orderid, patient, amount,qty,pharmacy } = findPharmacy;
            //pharmacy  
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
      if(amount > 0){
        var createpaymentqueryresult =await createpayment({firstName:patient?.firstName,lastName:patient?.lastName,MRN:patient?.MRN,phoneNumber:patient?.phoneNumber,paymentreference,paymentype:prescription,paymentcategory:pharmacy,patient:patient._id,amount,qty});
        await updateprescription(id,{dispensestatus:configuration.status[10],payment:createpaymentqueryresult._id});
        await updatepatient(patient._id,{$push: {payment:createpaymentqueryresult._id}});
        
      }
      else if(amount == 0){
        await updateprescription(id,{dispensestatus:configuration.status[10]});
      }
      input.patient=patient._id;
      input.serviceCategory=configuration.category[1];
      input.prescription=findPharmacy._id;
      input.authorizationCode=authorizationCode;
      input.approvalCode=approvalCode;
      input.amountClaimed= amount;
      input.amountApproved= amount;
      input.insurer= patient.HMOName;
      input.createdBy=createdBy;
           
    }
    else{
            throw new Error( "Invalid reference category");
    }

if (Object.keys(input).length !== 0)  await createInsuranceClaim(input);    

    res.status(200).json({
      queryresult: "Transaction authorized successfully.",
    status: true
    });
});
*/
// 🔹 MAIN CONTROLLER
export const authorizeTransaction = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { authorizationCode, approvalCode } = req.body;
  const { id, referencecategory } = req.params;
  const { _id} = (req.user).user;
  const createdBy = `${_id}`;
  validateinputfaulsyvalue({ authorizationCode, approvalCode, referencecategory, id });

  let insuranceClaim: any = null;

  if (referencecategory === configuration.referencecategory[0]) {
    insuranceClaim = await processLab(id, { authorizationCode, approvalCode, createdBy });
  } else if (referencecategory === configuration.referencecategory[1]) {
    insuranceClaim = await processRadiology(id, { authorizationCode, approvalCode, createdBy });
  } else if (referencecategory === configuration.referencecategory[2]) {
    insuranceClaim = await processProcedure(id, { authorizationCode, approvalCode, createdBy });
  } else if (referencecategory === configuration.referencecategory[3]) {
    insuranceClaim = await processPharmacy(id, { authorizationCode, approvalCode, createdBy });
  } else {
    throw new Error("Invalid reference category");
  }

  if (insuranceClaim) {
    await createInsuranceClaim(insuranceClaim);
  }

  res.status(200).json({
    queryresult: "Transaction authorized successfully",
    status: true
  });
});