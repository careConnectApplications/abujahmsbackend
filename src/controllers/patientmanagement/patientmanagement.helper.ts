
import configuration from "../../config";
import { createpayment } from "../../dao/payment";
import { calculateAmountPaidByHMO,validateinputfaulsyvalue } from "../../utils/otherservices";
import { createappointment } from "../../dao/appointment";
import { createpatient,  updatepatient } from "../../dao/patientmanagement";
import {readonehmocategorycover} from "../../dao/hmocategorycover";
import {readonehmomanagement} from "../../dao/hmomanagement";


interface PatientRegistrationStrategy {
  execute(args: {
    reqBody: any;
    appointmentid: string;
    newRegistrationPrice: any;
    annualsubscriptionnewRegistrationPrice: any;
    cardfeenewRegistrationPrice: any;
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
    newRegistrationPrice,
    annualsubscriptionnewRegistrationPrice,
    cardfeenewRegistrationPrice,
    vitals
  }) {
    // Create patient
    const createpatientqueryresult = await createpatient(reqBody);

    // Prices
    const amount = Number(newRegistrationPrice.amount);
    console.log("a")
    const annualsubscriptionamount = Number(annualsubscriptionnewRegistrationPrice.amount);
    const cardfeeamountamount = Number(cardfeenewRegistrationPrice.amount);

    let queryappointmentresult;
    let queryresult;
    let payment: string[] = [];

    if (amount == 0 && annualsubscriptionamount == 0 && cardfeeamountamount == 0) {
      reqBody.status = configuration.status[1];

      if (reqBody.appointmentdate) {
        queryappointmentresult = await createappointment({
          ...reqBody,
          appointmentid,
          vitals: vitals?._id,
          patient: createpatientqueryresult._id,
          MRN: createpatientqueryresult?.MRN,
        });

        queryresult = await updatepatient(createpatientqueryresult._id, {
          $push: { appointment: queryappointmentresult._id },
        });
      }

      return queryresult ?? createpatientqueryresult;
    } else {
      const payments = await Promise.all([
        amount > 0
          ? createpayment({
              ...reqBody,
              paymentreference: reqBody.MRN,
              paymentype: newRegistrationPrice.servicetype,
              paymentcategory: newRegistrationPrice.servicecategory,
              patient: createpatientqueryresult._id,
              amount,
            })
          : null,
        annualsubscriptionamount > 0
          ? createpayment({
              ...reqBody,
              paymentreference: reqBody.MRN,
              paymentype: annualsubscriptionnewRegistrationPrice.servicetype,
              paymentcategory: annualsubscriptionnewRegistrationPrice.servicecategory,
              patient: createpatientqueryresult._id,
              amount: annualsubscriptionamount,
            })
          : null,
        cardfeeamountamount > 0
          ? createpayment({
              ...reqBody,
              paymentreference: reqBody.MRN,
              paymentype: cardfeenewRegistrationPrice.servicetype,
              paymentcategory: cardfeenewRegistrationPrice.servicecategory,
              patient: createpatientqueryresult._id,
              amount: cardfeeamountamount,
            })
          : null,
      ]);

      payments.filter(Boolean).forEach((p: any) => payment.push(p._id));

      if (reqBody.appointmentdate) {
        queryappointmentresult = await createappointment({
          ...reqBody,
          appointmentid,
          payment: payments[0]?._id,
          vitals: vitals?._id,
          patient: createpatientqueryresult._id,
          MRN: createpatientqueryresult?.MRN,
        });

        queryresult = await updatepatient(createpatientqueryresult._id, {
          payment,
          $push: { appointment: queryappointmentresult._id },
        });
      }

      return queryresult ?? createpatientqueryresult;
    }
  },
};


const HMOPatientStrategy: PatientRegistrationStrategy = {
   
  async execute({
    reqBody,
    appointmentid,
    newRegistrationPrice,
    annualsubscriptionnewRegistrationPrice,
    cardfeenewRegistrationPrice,
    vitals
  }) {
     let {HMOName,HMOId,HMOPlan} = reqBody;
     let gethmo:any = await readonehmomanagement({hmoname:reqBody.HMOName},{_id:1,hmopercentagecover:1});
    reqBody.insurance = gethmo._id;
    validateinputfaulsyvalue({ HMOName,HMOId,HMOPlan });
    if(!gethmo){
      throw new Error("HMONAME does not exist");
    }
    // Create patient
    const createpatientqueryresult = await createpatient(reqBody);
    // Cover percentages
    const [insurance, annualsubscription, cardfee] = await Promise.all([
      readonehmocategorycover(
        { hmoId: gethmo?._id, category: configuration.category[3] },
        { hmopercentagecover: 1 }
      ),
      readonehmocategorycover(
        { hmoId: gethmo?._id, category: configuration.category[8] },
        { hmopercentagecover: 1 }
      ),
      readonehmocategorycover(
        { hmoId: gethmo?._id, category: configuration.category[9] },
        { hmopercentagecover: 1 }
      ),
    ]);

    const hmopercentagecover = insurance?.hmopercentagecover ?? 0;
    const annualsubscriptionhmopercentagecover = annualsubscription?.hmopercentagecover ?? 0;
    const cardfeehmopercentagecover = cardfee?.hmopercentagecover ?? 0;

    const amount = calculateAmountPaidByHMO(hmopercentagecover, Number(newRegistrationPrice.amount));
    const annualsubscriptionamount = calculateAmountPaidByHMO(
      annualsubscriptionhmopercentagecover,
      Number(annualsubscriptionnewRegistrationPrice.amount)
    );
    const cardfeeamountamount = calculateAmountPaidByHMO(
      cardfeehmopercentagecover,
      Number(cardfeenewRegistrationPrice.amount)
    );

    let queryappointmentresult;
    let queryresult;
    let payment: string[] = [];

    if (amount == 0 && annualsubscriptionamount == 0 && cardfeeamountamount == 0) {
      reqBody.status = configuration.status[1];

      if (reqBody.appointmentdate) {
        queryappointmentresult = await createappointment({
          ...reqBody,
          appointmentid,
          vitals: vitals?._id,
          patient: createpatientqueryresult._id,
          MRN: createpatientqueryresult?.MRN,
        });

        queryresult = await updatepatient(createpatientqueryresult._id, {
          $push: { appointment: queryappointmentresult._id },
        });
      }

      return queryresult ?? createpatientqueryresult;
    } else {
        const payments = await Promise.all([
        amount > 0
          ? createpayment({
              ...reqBody,
              paymentreference: reqBody.MRN,
              paymentype: newRegistrationPrice.servicetype,
              paymentcategory: newRegistrationPrice.servicecategory,
              patient: createpatientqueryresult._id,
              amount,
            })
          : null,
        annualsubscriptionamount > 0
          ? createpayment({
              ...reqBody,
              paymentreference: reqBody.MRN,
              paymentype: annualsubscriptionnewRegistrationPrice.servicetype,
              paymentcategory: annualsubscriptionnewRegistrationPrice.servicecategory,
              patient: createpatientqueryresult._id,
              amount: annualsubscriptionamount,
            })
          : null,
        cardfeeamountamount > 0
          ? createpayment({
              ...reqBody,
              paymentreference: reqBody.MRN,
              paymentype: cardfeenewRegistrationPrice.servicetype,
              paymentcategory: cardfeenewRegistrationPrice.servicecategory,
              patient: createpatientqueryresult._id,
              amount: cardfeeamountamount,
            })
          : null,
      ]);

      payments.filter(Boolean).forEach((p: any) => payment.push(p._id));

      // HMO → no self-pay createpayment, just mark approved with zero cost
      if (reqBody.appointmentdate) {
        queryappointmentresult = await createappointment({
          ...reqBody,
          appointmentid,
          vitals: vitals?._id,
          patient: createpatientqueryresult._id,
          MRN: createpatientqueryresult?.MRN,
        });


        queryresult = await updatepatient(createpatientqueryresult._id, {
          payment,
          $push: { appointment: queryappointmentresult._id },
        });

        
      }

      return queryresult ?? createpatientqueryresult;
    }
  },
};


export function selectPatientStrategy(isHMOCover: any) {
  if (isHMOCover == configuration.ishmo[1] || isHMOCover == true) {
    return HMOPatientStrategy;
  } else {
    return SelfPayPatientStrategy;
  }
}





