

import { NextFunction, Request, Response } from "express";
import {readoneradiology,updateradiology } from "../../dao/radiology";
import {readoneprocedure,updateprocedure} from "../../dao/procedure";
import {readoneprescription,updateprescription} from "../../dao/prescription";
import  {getPaymentReference} from "../../utils/otherservices";
import {readonelab,updatelab} from "../../dao/lab";
import {createpayment} from "../../dao/payment";
import {getHistopathologyByIdPopulate,updateHistopathologyRecord} from "../../dao/histopathology.dao";
import {updatepatient} from "../../dao/patientmanagement";
import configuration from "../../config";
////////////////////////   helper function for insurance claims

async function handlePayment(patient: any, paymentData: any, updateFn: Function, updateFilter: any, amountstatus:any, zeroAmountStatus: any,statusField: string,) {
  if (paymentData.amount > 0) {
    const createdPayment = await createpayment(paymentData);
    await updateFn(updateFilter, { [statusField]: amountstatus, payment: createdPayment._id });
    await updatepatient(patient._id, { $push: { payment: createdPayment._id } });
    return createdPayment;
  } else {
    await updateFn(updateFilter, { [statusField]: zeroAmountStatus });
    return null;
  }
}



// 🔹 Generate insurance claim
function buildInsuranceClaim({ patient, serviceCategory, entityId, entityKey, authorizationCode, approvalCode, amount, createdBy, action,actualcost }: any) {
  return {
    patient: patient._id,
    serviceCategory,
    [entityKey]: entityId,
    authorizationCode,
    approvalCode,
    amountClaimed: amount,
    amountApproved: amount,
    insurer: patient.HMOName,
    createdBy,
    action,
    actualcost
  };
}




// 🔹 Common payment reference resolver


// 🟢 LAB HANDLER
export async function processLab(id: string, ctx: any) {  
  const { authorizationCode, approvalCode, createdBy,action } = ctx;
  console.log("action", action);
  //find lab by id
  const lab: any = await readonelab({ _id: id }, {}, "patient");
  //get patient details, testname, testid, amount from lab
  const { testname, testid, patient, amount,actualcost } = lab;
//check if patient is admitted, if yes use admission number as payment reference
  const approvedamount = action == "approve" ? amount : actualcost;
  const paymentreference = await getPaymentReference(patient._id, testid);

  const paymentData = {
    firstName: patient?.firstName,
    lastName: patient?.lastName,
    MRN: patient?.MRN,
    phoneNumber: patient?.phoneNumber,
    paymentreference,
    paymentype: testname,
    paymentcategory: configuration.category[2],
    patient: patient._id,
    amount:approvedamount
  };
    //create payment if amount is greater than 0
    //update lab status to processed and add payment reference
    //add payment reference to patient
  await handlePayment(patient, paymentData, updatelab, { _id: id },configuration.status[2],configuration.status[5],"status");

  return buildInsuranceClaim({
    patient,
    serviceCategory: configuration.category[2],
    entityId: lab._id,
    entityKey: "lab",
    authorizationCode,
    approvalCode,
    amount:approvedamount,
    createdBy,
    action,
    actualcost
  });
}

// 🟢 RADIOLOGY HANDLER
export async function processRadiology(id: string, ctx: any) {
  const { authorizationCode, approvalCode, createdBy, action } = ctx;
// find radiology by id
  const radiology: any = await readoneradiology({ _id: id }, {}, "patient");
  // get patient details, testname, testid, amount from radiology
  const { testname, testid, patient, amount, actualcost } = radiology;
  //check if patient is admitted, if yes use admission number as payment reference
  const approvedamount = action == "approve" ? amount : actualcost;
  const paymentreference = await getPaymentReference(patient._id, testid);

  const paymentData = {
    firstName: patient?.firstName,
    lastName: patient?.lastName,
    MRN: patient?.MRN,
    phoneNumber: patient?.phoneNumber,
    paymentreference,
    paymentype: testname,
    paymentcategory: configuration.category[4],
    patient: patient._id,
    amount:approvedamount
  };

  await handlePayment(patient, paymentData, updateradiology, { _id: id },configuration.status[9],configuration.status[9],"status");

  return buildInsuranceClaim({
    patient,
    serviceCategory: configuration.category[4],
    entityId: radiology._id,
    entityKey: "radiology",
    authorizationCode,
    approvalCode,
    amount:approvedamount,
    createdBy,
    action,
    actualcost
  });
}

// 🟢 PROCEDURE HANDLER
export async function processProcedure(id: string, ctx: any) {
  const { authorizationCode, approvalCode, createdBy, action } = ctx;
 //find procedure by id
  const findprocedure: any = await readoneprocedure({ _id: id }, {}, "patient");
  const { procedure, procedureid, patient, amount, actualcost } = findprocedure;
  //check if patient is admitted, if yes use admission number as payment reference
  const approvedamount = action == "approve" ? amount : actualcost;
  const paymentreference = await getPaymentReference(patient._id, procedureid);

  const paymentData = {
    firstName: patient?.firstName,
    lastName: patient?.lastName,
    MRN: patient?.MRN,
    phoneNumber: patient?.phoneNumber,
    paymentreference,
    paymentype: procedure,
    paymentcategory: configuration.category[5],
    patient: patient._id,
    amount:approvedamount
  };

  await handlePayment(patient, paymentData, updateprocedure, { _id: id },configuration.status[9],configuration.status[9],"status");

  return buildInsuranceClaim({
    patient,
    serviceCategory: configuration.category[5],
    entityId: findprocedure._id,
    entityKey: "procedure",
    authorizationCode,
    approvalCode,
    amount:approvedamount,
    createdBy,
    action,
    actualcost
  });
}

// 🟢 PHARMACY HANDLER
export async function processPharmacy(id: string, ctx: any) {
  const { authorizationCode, approvalCode, createdBy, action } = ctx;
  const findPharmacy: any = await readoneprescription({_id:id},{},'patient','','');
  const { prescription, orderid, patient, amount, actualcost, qty, pharmacy } = findPharmacy;
  //check if patient is admitted, if yes use admission number as payment reference
  const approvedamount = action == "approve" ? amount : actualcost;
  const paymentreference = await getPaymentReference(patient._id, orderid);

  const paymentData = {
    firstName: patient?.firstName,
    lastName: patient?.lastName,
    MRN: patient?.MRN,
    phoneNumber: patient?.phoneNumber,
    paymentreference,
    paymentype: prescription,
    paymentcategory: pharmacy,
    patient: patient._id,
    amount:approvedamount,
    qty
  };

  await handlePayment(patient, paymentData, updateprescription, { _id: id },configuration.status[10],configuration.status[10],"dispensestatus");

  return buildInsuranceClaim({
    patient,
    serviceCategory: configuration.category[1],
    entityId: findPharmacy._id,
    entityKey: "pharmacy",
    authorizationCode,
    approvalCode,
    amount:approvedamount,
    createdBy,
    action,
    actualcost
  });
}

export async function processHistopathology(id: any, ctx: any){
     const { authorizationCode, approvalCode, createdBy, action } = ctx;
   const findHistopathology =await  getHistopathologyByIdPopulate(id);
     const { patient, amount, actualcost, refNumber } = findHistopathology;
     //check if patient is admitted, if yes use admission number as payment reference
     const approvedamount = action == "approve" ? amount : actualcost;   
    const paymentData = {
            paymentreference: refNumber,
            paymentype: configuration.category[6],
            paymentcategory: configuration.category[6], // Histopathology category
            patient: patient?._id,
            firstName: patient?.firstName,
            lastName: patient?.lastName,
            MRN: patient?.MRN,
            phoneNumber: patient?.phoneNumber,
            amount:approvedamount
        }
      await handlePayment(patient, paymentData, updateHistopathologyRecord, { _id: id },configuration.status[5],configuration.status[5],"status");  
      return buildInsuranceClaim({
    patient,
    serviceCategory: configuration.category[6],
    entityId: findHistopathology._id,
    entityKey: "histopathology",
    authorizationCode,
    approvalCode,
    amount:approvedamount,
    createdBy,
    action,
    actualcost
  });
    
    
}
