
import configuration from "../../config";
import { createpayment } from "../../dao/payment";
import { calculateAmountPaidByHMO,validateinputfaulsyvalue } from "../../utils/otherservices";
import { createappointment } from "../../dao/appointment";
import { createpatient,  updatepatient } from "../../dao/patientmanagement";
import {readonehmocategorycover} from "../../dao/hmocategorycover";
import {readonehmomanagement} from "../../dao/hmomanagement";
import { createInsuranceClaim } from "../../dao/insuranceclaim";

interface PatientRegistrationStrategy {
  execute(args: {
    reqBody: any;
    appointmentid: string;
    annualsubscriptionnewRegistrationPrice: any;
    cardfeenewRegistrationPrice: any;
    appointmentPrice?: any;
    gethmo?: any;
    vitals?: any;
  }): Promise<any>;
}
export const PatientRegistrationContext = (strategy: PatientRegistrationStrategy) => ({
  execute: async (args: Parameters<PatientRegistrationStrategy["execute"]>[0]) =>
    strategy.execute(args),
});


const SelfPayPatientStrategy: PatientRegistrationStrategy = {
  async execute({
    reqBody,
    appointmentid,
    annualsubscriptionnewRegistrationPrice,
    cardfeenewRegistrationPrice,
    appointmentPrice,
    vitals
  }) {
    
    // Prices for optional services only
    const annualsubscriptionamount = Number(annualsubscriptionnewRegistrationPrice.amount);
    const cardfeeamountamount = Number(cardfeenewRegistrationPrice.amount);
    
    // Appointment amount (if appointment is being scheduled)
    const appointmentAmount = appointmentPrice ? Number(appointmentPrice.amount) : 0;

     if(cardfeeamountamount == 0) reqBody.status = configuration.status[1];
     // Create patient
     const createpatientqueryresult = await createpatient(reqBody);


    let queryappointmentresult;
    let queryresult;
    let payment: string[] = [];

    // Create payments for all services that have non-zero amounts
    const payments = await Promise.all([
      annualsubscriptionamount > 0
        ? createpayment({
            ...reqBody,
            paymentreference: appointmentid,
            paymentype: annualsubscriptionnewRegistrationPrice.servicetype,
            paymentcategory: annualsubscriptionnewRegistrationPrice.servicecategory,
            patient: createpatientqueryresult._id,
            amount: annualsubscriptionamount,
          })
        : null,
      cardfeeamountamount > 0
        ? createpayment({
            ...reqBody,
            paymentreference: appointmentid,
            paymentype: cardfeenewRegistrationPrice.servicetype,
            paymentcategory: cardfeenewRegistrationPrice.servicecategory,
            patient: createpatientqueryresult._id,
            amount: cardfeeamountamount,
          })
        : null,
      appointmentAmount > 0 && reqBody.appointmentdate
        ? createpayment({
            ...reqBody,
            paymentreference: appointmentid,
            paymentype: reqBody.appointmenttype,
            paymentcategory: reqBody.appointmentcategory,
            patient: createpatientqueryresult._id,
            amount: appointmentAmount,
          })
        : null,
    ]);

    payments.filter(Boolean).forEach((p: any) => payment.push(p._id));

    if (reqBody.appointmentdate) {
      // Find appointment payment or any other payment for linking
      const appointmentPayment = appointmentAmount > 0 ? payments[2] : null;
      
      queryappointmentresult = await createappointment({
        ...reqBody,
        appointmentid,
        payment: appointmentPayment?._id,
        vitals: vitals?._id,
        patient: createpatientqueryresult._id,
        MRN: createpatientqueryresult?.MRN,
         amount: appointmentAmount,
      });

      queryresult = await updatepatient(createpatientqueryresult._id, {
        ...(payment.length > 0 ? { payment } : {}),
        $push: { appointment: queryappointmentresult._id },
      });
    } else if (payment.length > 0) {
      queryresult = await updatepatient(createpatientqueryresult._id, { payment });
    }

    return queryresult ?? createpatientqueryresult;
  },
};


const HMOPatientStrategy: PatientRegistrationStrategy = {
   
  async execute({
    reqBody,
    appointmentid,
    annualsubscriptionnewRegistrationPrice,
    cardfeenewRegistrationPrice,
    appointmentPrice,
    vitals
  }) {
     let {HMOName,HMOId,HMOPlan} = reqBody;
     let gethmo:any = await readonehmomanagement({hmoname:reqBody.HMOName},{_id:1,hmopercentagecover:1});
    reqBody.insurance = gethmo._id;
    validateinputfaulsyvalue({ HMOName,HMOId,HMOPlan });
    if(!gethmo){
      throw new Error("HMONAME does not exist");
    }
  
    
    // Get HMO coverage for all services including appointments
    const coveragePromises = [
      readonehmocategorycover(
        { hmoId: gethmo?._id, category: configuration.category[8] },
        { hmopercentagecover: 1 }
      ),
      readonehmocategorycover(
        { hmoId: gethmo?._id, category: configuration.category[9] },
        { hmopercentagecover: 1 }
      ),
    ];
    
    // Add appointment coverage if appointment is being scheduled
    if (reqBody.appointmentdate && appointmentPrice) {
      coveragePromises.push(
        readonehmocategorycover(
          { hmoId: gethmo?._id, category: configuration.category[0] },
          { hmopercentagecover: 1 }
        )
      );
    }
    
    const coverageResults = await Promise.all(coveragePromises);
    const [annualsubscription, cardfee, appointmentCoverage] = coverageResults;

    const annualsubscriptionhmopercentagecover = annualsubscription?.hmopercentagecover ?? 0;
    const cardfeehmopercentagecover = cardfee?.hmopercentagecover ?? 0;
    const appointmenthmopercentagecover = appointmentCoverage?.hmopercentagecover ?? 0;

    

    // Calculate amounts after HMO coverage
    const annualsubscriptionamount = calculateAmountPaidByHMO(
      annualsubscriptionhmopercentagecover,
      Number(annualsubscriptionnewRegistrationPrice.amount)
    );
    const cardfeeamountamount = calculateAmountPaidByHMO(
      cardfeehmopercentagecover,
      Number(cardfeenewRegistrationPrice.amount)
    );
    const appointmentAmount = appointmentPrice ? 
      calculateAmountPaidByHMO(
        appointmenthmopercentagecover,
        Number(appointmentPrice.amount)
      ) : 0;
      console.log("appointmentAmount",appointmentAmount);
      console.log("cardfeeamountamount",cardfeeamountamount);
      console.log("annualsubscriptionamount",annualsubscriptionamount);

    if(cardfeeamountamount == 0) reqBody.status = configuration.status[1];
   
        // Create patient
    const createpatientqueryresult = await createpatient(reqBody);
   

    let queryappointmentresult;
    let queryresult;
    let payment: string[] = [];

    // Create payments for all services that have non-zero amounts after HMO coverage
    const payments = await Promise.all([
      annualsubscriptionamount > 0
        ? createpayment({
            ...reqBody,
            paymentreference: appointmentid,
            paymentype: annualsubscriptionnewRegistrationPrice.servicetype,
            paymentcategory: annualsubscriptionnewRegistrationPrice.servicecategory,
            patient: createpatientqueryresult._id,
            amount: annualsubscriptionamount,
          })
        : null,
      cardfeeamountamount > 0
        ? createpayment({
            ...reqBody,
            paymentreference: appointmentid,
            paymentype: cardfeenewRegistrationPrice.servicetype,
            paymentcategory: cardfeenewRegistrationPrice.servicecategory,
            patient: createpatientqueryresult._id,
            amount: cardfeeamountamount,
          })
        : null,
      appointmentAmount > 0 && reqBody.appointmentdate
        ? createpayment({
            ...reqBody,
            paymentreference: appointmentid,
            paymentype: reqBody.appointmenttype,
            paymentcategory: reqBody.appointmentcategory,
            patient: createpatientqueryresult._id,
            amount: appointmentAmount,
          })
        : null,
    ]);

    payments.filter(Boolean).forEach((p: any) => payment.push(p._id));

    // Create insurance claims for HMO covered services
    const insuranceClaims = [];
    
    // Insurance claim for annual subscription if HMO covers it
    if (annualsubscriptionhmopercentagecover > 0 && payments[0]) {
      insuranceClaims.push({
        patient: createpatientqueryresult._id,
        serviceCategory: configuration.category[8],
        payment: payments[0]._id,
        authorizationCode: reqBody.authorizationcode || "",
        approvalCode: reqBody.approvalCode || "",
        amountClaimed: annualsubscriptionamount,
        amountApproved: annualsubscriptionamount,
        insurer: HMOName,
        createdBy: reqBody.createdBy,
        action: "approve",
        actualcost: Number(annualsubscriptionnewRegistrationPrice.amount)
      });
    }
    
    // Insurance claim for card fee if HMO covers it
    if (cardfeehmopercentagecover > 0 && payments[1]) {
      insuranceClaims.push({
        patient: createpatientqueryresult._id,
        serviceCategory: configuration.category[9],
        payment: payments[1]._id,
        authorizationCode: reqBody.authorizationcode || "",
        approvalCode: reqBody.approvalCode || "",
        amountClaimed: cardfeeamountamount,
        amountApproved: cardfeeamountamount,
        insurer: HMOName,
        createdBy: reqBody.createdBy,
        action: "approve",
        actualcost: Number(cardfeenewRegistrationPrice.amount)
      });
    }

    if (reqBody.appointmentdate) {
      // Find appointment payment for linking
      const appointmentPayment = appointmentAmount > 0 ? payments[2] : null;
      
      queryappointmentresult = await createappointment({
        ...reqBody,
        appointmentid,
        payment: appointmentPayment?._id,
        vitals: vitals?._id,
        patient: createpatientqueryresult._id,
        MRN: createpatientqueryresult?.MRN,
        amount: appointmentAmount,
      });

      // Insurance claim for appointment if HMO covers it
      if (appointmenthmopercentagecover > 0 && appointmentPrice && payments[2]) {
        insuranceClaims.push({
          patient: createpatientqueryresult._id,
          serviceCategory: configuration.category[0],
          appointment: queryappointmentresult._id,
          payment: payments[2]._id,
          authorizationCode: reqBody.authorizationcode || "",
          approvalCode: reqBody.approvalCode || "",
          amountClaimed: appointmentAmount,
          amountApproved: appointmentAmount,
          insurer: HMOName,
          createdBy: reqBody.createdBy,
          action: "approve",
          actualcost: Number(appointmentPrice.amount)
        });
      }

      queryresult = await updatepatient(createpatientqueryresult._id, {
        ...(payment.length > 0 ? { payment } : {}),
        $push: { appointment: queryappointmentresult._id },
      });
    } else if (payment.length > 0) {
      queryresult = await updatepatient(createpatientqueryresult._id, { payment });
    }
    
    // Create all insurance claims
    if (insuranceClaims.length > 0) {
      await createInsuranceClaim(insuranceClaims);
    }

    return queryresult ?? createpatientqueryresult;
  },
};


export function selectPatientStrategy(isHMOCover: any) {
  if (isHMOCover == configuration.ishmo[1] || isHMOCover == true) {
    return HMOPatientStrategy;
  } else {
    return SelfPayPatientStrategy;
  }
}
