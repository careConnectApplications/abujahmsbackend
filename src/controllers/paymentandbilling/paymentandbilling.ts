import { NextFunction, Request, Response } from "express";
import { readallpayment, readonepayment, updatepayment, updatepaymentbyquery, readallpaymentaggregate, readpaymentaggregate, readpaymentaggregateoptimized, createpayment } from "../../dao/payment";
import { updateappointmentbyquery } from "../../dao/appointment";
import { updatepatientbyanyquery, readonepatient } from "../../dao/patientmanagement";
import { updatelabbyquery } from "../../dao/lab";
import configuration from "../../config";
<<<<<<< HEAD
import { validateinputfaulsyvalue, calculateAmountPaidByHMO } from "../../utils/otherservices";
=======
import { validateinputfaulsyvalue } from "../../utils/otherservices";
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
import catchAsync from "../../utils/catchAsync";
import mongoose from "mongoose";
import { ApiError } from "../../errors";
import { readoneprice } from "../../dao/price";
import { v4 as uuidv4 } from 'uuid';
<<<<<<< HEAD
import { createInsuranceClaim } from "../../dao/insuranceclaim";
import { readonehmomanagement } from "../../dao/hmomanagement";
import { readonehmocategorycover } from "../../dao/hmocategorycover";
=======
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

const generatePaymentNumber = () => {
  const uniqueId = uuidv4();
  return `Billing-${new Date().getFullYear()}-${uniqueId}`;
}
<<<<<<< HEAD
export const payAnnualSubscription = catchAsync(async (req: Request | any, res: Response) => {
    const { patientId } = req.body;
    const { _id: userId } = (req.user).user;
    
    // Check patient exists
    const patient: any = await readonepatient({ _id: patientId}, {}, '', '');
    if (!patient) {
      throw new Error("Patient not found" );
    }
    
    const subscriptionPrice: any = await readoneprice({ 
      servicecategory: configuration.category[8], 
      servicetype: configuration.category[8] 
    });
    if (!subscriptionPrice) {
      throw new Error(configuration.error.errornopriceset);
    }
    
    let paymentAmount = Number(subscriptionPrice.amount);
    let hmoCoveragePercentage = 0;
    let gethmo: any = null;
    
    // Check if patient has HMO coverage
    if (patient.isHMOCover === configuration.ishmo[1] || patient.isHMOCover === true) {
      // Get HMO details
      if (patient.HMOName) {
        gethmo = await readonehmomanagement(
          { hmoname: patient.HMOName }, 
          { _id: 1, hmopercentagecover: 1 }
        );
        
        if (gethmo) {
          // Get HMO coverage percentage for annual subscription
          const hmoCoverage = await readonehmocategorycover(
            { hmoId: gethmo._id, category: configuration.category[8] },
            { hmopercentagecover: 1 }
          );
          
          hmoCoveragePercentage = hmoCoverage?.hmopercentagecover ?? 0;
          
          // Calculate patient payment amount after HMO coverage
          if (hmoCoveragePercentage > 0) {
            paymentAmount = calculateAmountPaidByHMO(
              hmoCoveragePercentage,
              Number(subscriptionPrice.amount)
            );
          }
        }
      }
    }
    
    // Create payment with adjusted amount
    const payment = await createpayment({
      firstName: patient?.firstName,
      lastName: patient?.lastName,
      MRN: patient?.MRN,
      phoneNumber: patient?.phoneNumber,
      paymentreference: patient._id,
      paymentype: configuration.category[8],
      paymentcategory: configuration.category[8],
      patient: patient._id,
      amount: paymentAmount
    });
    
    // Create insurance claim for HMO patients
    if ((patient.isHMOCover === configuration.ishmo[1] || patient.isHMOCover === true) && 
        hmoCoveragePercentage > 0 && payment) {
      const insuranceClaim = {
        patient: patient._id,
        serviceCategory: configuration.category[8],
        payment: payment._id,
        authorizationCode: patient.authorizationCode || req.body.authorizationCode || "",
        approvalCode: patient.approvalCode || req.body.approvalCode || "",
        amountClaimed: Number(subscriptionPrice.amount),
        amountApproved: Number(subscriptionPrice.amount),
        insurer: patient.HMOName,
        createdBy: userId,
        action: "approve"
      };
      
      await createInsuranceClaim(insuranceClaim);
    }
    
    // Extend subscription by 1 year
    res.status(201).json({ 
      queryresult: "Subscription payment recorded", 
      payment,
      status: true 
    });
});
=======

>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
///deactivate a user
//show total for each login cashier
export const getCashierTotal = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {

  const { email } = (req.user).user;
  // Get start and end of today (local time)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const total = await readallpaymentaggregate([
    { $match: { status: configuration.status[3], cashieremail: email, updatedAt: { $gte: startOfDay, $lte: endOfDay } } }, // Filter only completed payments if needed
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" }
      }
    }
  ]);


  res.json({ queryresult: total[0]?.totalAmount || 0, status: true });

});
//cashieremail:email,cashierid:staffId
//confirm payment
export async function confirmgrouppayment(req: any, res: any) {
<<<<<<< HEAD
    try {
=======
  //console.log(req.user);
  try {
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    const { paymentreferenceid } = req.params;
    //check for null of id
    const response: any = await readallpayment({ paymentreference: paymentreferenceid, status: configuration.status[2] }, '');
    const { paymentdetails } = response;
<<<<<<< HEAD
    if (!paymentdetails || paymentdetails.length === 0) throw new Error("no paymentfound for this service");
    for (var i = 0; i < paymentdetails.length; i++) {
    
      let { paymentype, paymentcategory, paymentreference, patient, _id } = paymentdetails[i]
      //const {patient} = paymentdetails[i];
      const patientrecord:any = await readonepatient({ _id: patient, status: configuration.status[1] }, {}, '', '');
    // if patient not found and patient is not paying for card return error
      if (!patientrecord && !paymentcategory == configuration.category[9]) {
      
        throw new Error(`Patient does not ${configuration.error.erroralreadyexit} or has not made payment for card`);

      }
      
      //ensure card fee and annual fee is paid before confirming payment for patient registration 
      
      //var settings =await  configuration.settings();
      const status = configuration.status[3];
      const { email, staffId, firstName, lastName } = (req.user).user;
      var cashiername = `${firstName} ${lastName}`;
      const queryresult: any = await updatepayment(_id, { status, cashieremail: email, cashiername, cashierid: staffId });
      //const {paymentype,paymentcategory,paymentreference} = queryresult;
      //for patient registration
      if (paymentcategory == configuration.category[9]) {
        console.log('*********', patient);
        //update patient registration status
        await updatepatientbyanyquery({ _id: patient }, { status: configuration.status[1], paymentstatus: status, paymentreference });
      }


      //for lab test
      else if (paymentcategory == configuration.category[2]) {
        //update lab test
        await updatelabbyquery({ payment: _id }, { status: configuration.status[5] })
      }
      else if(paymentcategory ==configuration.category[8]){
        console.log('*********', configuration.category[8]);
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        await updatepatientbyanyquery({_id:patient}, { subscriptionPaidUntil: nextYear, subscriptionExpired:false });
      }

=======
    console.log('before', paymentdetails);
    console.log('length', paymentdetails.length);

    for (var i = 0; i < paymentdetails.length; i++) {
      console.log('paymentdetails', paymentdetails[i])
      let { paymentype, paymentcategory, paymentreference, patient, _id } = paymentdetails[i]

      //const {patient} = paymentdetails[i];
      const patientrecord = await readonepatient({ _id: patient, status: configuration.status[1] }, {}, '', '');
      console.log('patient', patientrecord);
      if (!patientrecord && paymentcategory !== configuration.category[3]) {
        console.log('true');
        throw new Error(`Patient donot ${configuration.error.erroralreadyexit} or has not made payment for registration`);

      }
      //var settings =await  configuration.settings();
      const status = configuration.status[3];
      const { email, staffId, firstName, lastName } = (req.user).user;
      var cashiername = `${firstName} ${lastName}`;
      const queryresult: any = await updatepayment(_id, { status, cashieremail: email, cashiername, cashierid: staffId });
      //const {paymentype,paymentcategory,paymentreference} = queryresult;
      //for patient registration
      if (paymentcategory == configuration.category[3]) {
        //update patient registration status
        await updatepatientbyanyquery({ _id: patient }, { status: configuration.status[1], paymentstatus: status, paymentreference });
      }


      //for lab test
      else if (paymentcategory == configuration.category[2]) {
        //update lab test
        await updatelabbyquery({ payment: _id }, { status: configuration.status[5] })
      }

>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    }

    res.status(200).json({
      queryresult: paymentreferenceid,
      status: true
    });


  }
  catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

  }

}

export async function readpaymentbyreferencenumber(req: any, res: any) {
  //
  try {
    const { paymentreference } = req.params;
    //validate ticket id
    validateinputfaulsyvalue({
      paymentreference,

    });

    var populatequery = 'patient';
    // Aggregation to calculate sum and add it as a new field
    var query = { paymentreference };
    let totalAmount = await readallpaymentaggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: null, // null means no grouping, we just want the total sum for the entire collection
          totalAmount: { $sum: "$amount" } // Sum of the itemPrice for all documents
        }
      },
      {
        $project: {
          totalAmount: 1,
          _id: 0
        }
      }

    ]);

    const queryresult = await readallpayment({ paymentreference }, populatequery);

    res.json({
      queryresult,
      totalAmount,
      status: true,
    });
  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });
  }
}
//recall

export async function groupreadallpayment(req: any, res: any) {
  try {
    //const { paymentreference } = req.params;
    var { status } = req.params;
    var filter: any = {};

    if (status == "paid") {
      filter.status = configuration.status[3]

    }
    else {
      filter.status = configuration.status[2];

    }


    const referencegroup = [
      //look up patient
      //add query
      {
        $match: filter
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
          _id: "$paymentreference",
          paymentreference: { $first: "$paymentreference" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          amount: { $sum: "$amount" },
          patient: { $first: "$patient" }
        },
      },
      {
        $project: {
          _id: 0,
          paymentreference: 1,
          createdAt: 1,
          updatedAt: 1,
          amount: 1,
          patient: 1

        }
      },

      { $sort: { createdAt: -1 } },


    ];

    const queryresult = await readpaymentaggregate(referencegroup);
    res.json({
      queryresult,
      status: true,
    });


  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });
  }
}

export async function groupreadallpaymentoptimized(req: any, res: any) {
  try {
    //const { paymentreference } = req.params;
    var { status, firstName, MRN, HMOId, lastName, phoneNumber, email, paymentreference } = req.query;
    //var filter:any = {};
    var statusfilter: any = {};
    console.log('/////query//', req.query);
    var page = parseInt(req.query.page) || 1;
    var size = parseInt(req.query.size) || 150;
    if (status == "paid") {
      statusfilter.status = configuration.status[3]
    }
    else {
      statusfilter.status = configuration.status[2];

    }
    if (paymentreference) statusfilter.paymentreference = paymentreference;
    if (firstName) statusfilter.firstName = new RegExp(`^${firstName}`, 'i');
    if (lastName) statusfilter.lastName = new RegExp(`^${lastName}`, 'i');
    if (MRN) statusfilter.MRN = new RegExp(`^${MRN}`, 'i');
    if (phoneNumber) statusfilter.phoneNumber = new RegExp(`^${phoneNumber}`, 'i');

    //paymentreference
    ////////////////////////////////////
    const pipeline = [];

    // Add status filter
    pipeline.push({ $match: statusfilter });
    pipeline.push({
      $group: {
        _id: "$paymentreference",
        paymentreference: { $first: "$paymentreference" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        amount: { $sum: "$amount" },
        firstName: { $first: "$firstName" },
        phoneNumber: { $first: "$phoneNumber" },
        lastName: { $first: "$lastName" },
        MRN: { $first: "$MRN" }
      },
    });
    pipeline.push({
      $project: {
        _id: 0,
        paymentreference: 1,
        createdAt: 1,
        updatedAt: 1,
        amount: 1,
        firstName: 1,
        phoneNumber: 1,
        lastName: 1,
        MRN: 1,
      },
    })

    // Sorting
    pipeline.push({ $sort: { createdAt: -1 } });



    const queryresult = await readpaymentaggregateoptimized(pipeline, page, size);
    console.log('*******', queryresult);
    res.json({
      queryresult,
      status: true,
    });


  } catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });
  }
}

//read particular patient payment history
export async function readbillinghistoryforapatient(req: any, res: any) {
  try {
    const { id } = req.params;
    var query = { patient: id };
    var populatequery = 'patient';
    const queryresult = await readallpayment(query, populatequery);

    res.json({
      queryresult,
      status: true,
    });
  }
  catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

  }

}

//get billing history for all patient

export async function readbillinghistoryforallapatient(req: any, res: any) {
  try {

    var query = {};
    var populatequery = 'patient';
    const queryresult = await readallpayment(query, populatequery);

    res.json({
      queryresult,
      status: true,
    });
  }
  catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

  }

}

//confirm payment
export async function confirmpayment(req: any, res: any) {
  //console.log(req.user);
  try {
    const { id } = req.params;
    //check for null of id
    const response: any = await readonepayment({ _id: id });
<<<<<<< HEAD
    if (!response) throw new Error("no payment found for this service");
    const { patient,paymentcategory, paymentreference } = response;
    const patientrecord:any = await readonepatient({ _id: patient, status: configuration.status[1] }, {}, '', '');
     let cardFeePaid;
     let subscriptionfeePaid;
    if (!patientrecord && paymentcategory !== configuration.category[9]) {
      throw new Error(`Patient does not ${configuration.error.erroralreadyexit} or has not made payment for card`);
=======
    const { patient } = response;
    const patientrecord = await readonepatient({ _id: patient, status: configuration.status[1] }, {}, '', '');
    console.log('patient', patientrecord);
    if (!patientrecord && response.paymentcategory !== configuration.category[3]) {
      throw new Error(`Patient donot ${configuration.error.erroralreadyexit} or has not made payment for registration`);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    }
    
    

    //var settings =await  configuration.settings();
    const status = configuration.status[3];
    const { email, staffId } = (req.user).user;
    const queryresult: any = await updatepayment(id, { status, cashieremail: email, cashierid: staffId });
    //const queryresult:any =await updatepayment(id,{status});
    //confirm payment of the service paid for 
<<<<<<< HEAD

    //for patient registration
    if (paymentcategory == configuration.category[9]) {

=======
    const { paymentype, paymentcategory, paymentreference } = queryresult;
    //for patient registration
    if (paymentcategory == configuration.category[3]) {
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
      //update patient registration status
      await updatepatientbyanyquery({ _id: patient }, { status: configuration.status[1] });


<<<<<<< HEAD
    }    /*
=======
    }
    /*
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
    
    //for appointment
    else if(paymentcategory == configuration.category[0]){
      //schedule the patient
      //payment
      await updateappointmentbyquery({payment:id},{status:configuration.status[5]});
<<<<<<< HEAD

    }
      */

    //for lab test
    else if (paymentcategory == configuration.category[2]) {
      //update lab test
      await updatelabbyquery({ payment: id }, { status: configuration.status[5] })
    }
    else if(paymentcategory ==configuration.category[8]){
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        patientrecord.subscriptionExpired=false;
        patientrecord.subscriptionPaidUntil = nextYear;
        await patientrecord.save();
      }
    //update for pharmacy


=======

    }
      */

    //for lab test
    else if (paymentcategory == configuration.category[2]) {
      //update lab test
      await updatelabbyquery({ payment: id }, { status: configuration.status[5] })
    }
    //update for pharmacy


>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109

    res.status(200).json({
      queryresult,
      status: true
    });

  }
  catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

  }

}

//print receipt
export async function printreceipt(req: any, res: any) {
  try {
    const { paymentreference } = req.params;
    const { firstName, lastName } = (req.user).user;
    var staffname = `${firstName} ${lastName}`;
    //paymentreference
    var query = { paymentreference, status: configuration.status[3] };
    var populatequery = 'patient';
    let queryresult: any = await readallpayment({ paymentreference, status: configuration.status[3] }, populatequery);
    //get total sum
    // Aggregation to calculate sum and add it as a new field
    let totalAmount = await readallpaymentaggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: null, // null means no grouping, we just want the total sum for the entire collection
          totalAmount: { $sum: "$amount" } // Sum of the itemPrice for all documents
        }
      },
      {
        $project: {
          totalAmount: 1,
          _id: 0
        }
      }

    ]);

    //update numberoftimesprinted
    await updatepaymentbyquery(query, { $inc: { numberoftimesprinted: 1 } });
    res.json({
      queryresult,
      totalAmount,
      timestamp: new Date().toLocaleString("en-NG", {
        timeZone: "Africa/Lagos"
      }),
      printedbystaffname: staffname,
      status: true,
    });
  }
  catch (e: any) {
    console.log(e);
    res.status(403).json({ status: false, msg: e.message });

<<<<<<< HEAD
  }

}

export const CreateBilingRecord = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { patientId } = req.params;
  const {
    serviceCategory, amount,
    serviceType, phoneNumber, option, department } = req.body;

  const { _id: userId } = (req.user).user;

  // Fetch patient with insurance populated (like laborder does)
  const foundPatient: any = await readonepatient({ _id: patientId }, {}, 'insurance', '');

  if (!foundPatient) {
    return next(new ApiError(404, `Patient do not already exists`));
  }

  const { firstName, lastName, } = foundPatient;

  // Handle fixed pricing option
  let finalAmount = Number(amount);
  let actualAmount = Number(amount); // Store original amount for insurance claims
  
  if (option === "fixed") {
    // Fetch price from database like laborder does
    const servicePrice: any = await readoneprice({ 
      servicecategory: serviceCategory,
      servicetype: serviceType 
    });
    
    if (!servicePrice || servicePrice.amount == null) {
      throw new Error(`${configuration.error.errornopriceset} for ${serviceCategory}/${serviceType}`);
    }
    
    finalAmount = Number(servicePrice.amount);
    actualAmount = Number(servicePrice.amount);
  }

  // Calculate HMO coverage for insurance patients (like laborder)
  let hmopercentagecover = 0;
  if (foundPatient.insurance) {
    const insurance: any = await readonehmocategorycover(
      { 
        hmoId: foundPatient.insurance._id, 
        category: serviceCategory 
      }, 
      { hmopercentagecover: 1 }
    );
    
    hmopercentagecover = insurance?.hmopercentagecover ?? 0;
    
    // Adjust amount based on HMO coverage
    if (hmopercentagecover > 0) {
      finalAmount = calculateAmountPaidByHMO(
        Number(hmopercentagecover), 
        actualAmount
      );
    }
  }

  const refNumber = generatePaymentNumber();
  

  const paymentInfo = await createpayment({
    firstName,
    lastName,
    MRN: req.body.MRN || foundPatient.MRN,
    phoneNumber,
    billingtype:"custom-billing",
    department, // Add department to payment
    paymentreference: refNumber,
    paymentype: serviceType,
    paymentcategory: serviceCategory,
    patient: foundPatient._id,
    amount: finalAmount,
    createdById: userId,
  });

  // Create insurance claim for HMO patients with coverage > 0
  if (hmopercentagecover > 0 && paymentInfo) {
    const insuranceClaim = {
      patient: foundPatient._id,
      serviceCategory: serviceCategory,
      payment: paymentInfo._id,
      authorizationCode: foundPatient.authorizationCode || req.body.authorizationCode || "",
      approvalCode: foundPatient.approvalCode || req.body.approvalCode || "",
      amountClaimed: finalAmount, // Original amount before HMO adjustment
      amountApproved: finalAmount,
      insurer: foundPatient.HMOName,
      createdBy: userId,
      action: "approve",
      actualcost: actualAmount
    };
    
    await createInsuranceClaim(insuranceClaim);
  }

=======
  }

}

export const CreateBilingRecord = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { patientId } = req.params;
  const {
    serviceCategory, amount,
    serviceType, phoneNumber } = req.body;

  const { _id: userId } = (req.user).user;

  const foundPatient: any = await readonepatient({ _id: patientId }, {}, '', '');

  if (!foundPatient) {
    return next(new ApiError(404, `Patient do not ${configuration.error.erroralreadyexit}`));
  }

  const { firstName, lastName, } = foundPatient;

  const refNumber = generatePaymentNumber();

  const paymentInfo = await createpayment({
    firstName,
    lastName,
    MRN: req.body.MRN,
    phoneNumber,
    paymentreference: refNumber,
    paymentype: serviceType,
    paymentcategory: serviceCategory,
    patient: foundPatient._id,
    amount: Number(amount),
    createdById: userId,
  });

>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
  res.status(201).json({
    status: true,
    message: "custom billing info created for user!",
    data: paymentInfo
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
