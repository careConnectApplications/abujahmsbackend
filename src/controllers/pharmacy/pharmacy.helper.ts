
import configuration from "../../config";
import {updatepatient} from "../../dao/patientmanagement";
import {createpayment} from "../../dao/payment";
import { updateprescription,createprescription } from "../../dao/prescription";
import {readoneadmission} from  "../../dao/admissions";
import { getPaymentReference,calculateAmountPaidByHMO } from "../../utils/otherservices";

export interface PharmacyOrderStrategy {
  execute(args: {
    id: any;
    option: boolean;
    remark?: string;
    qty: number;
    prescriptionresponse: any;
    orderPrice: any;
    patient: any;
    orderid: string;
    hmopercentagecover:number;
    actualcost:number;
    pharmacy: string;
    amount: number;
  }): Promise<any>;
}





// ✅ SelfPayPharmacyOrderStrategy
export const SelfPayPharmacyOrderStrategy: PharmacyOrderStrategy = {
  async execute({
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
  }) {
    let queryresult;
    const paymentreference = await getPaymentReference(patient._id, orderid);
    if (option == true) {
      const createpaymentqueryresult = await createpayment({
        firstName: patient?.firstName,
        lastName: patient?.lastName,
        MRN: patient?.MRN,
        phoneNumber: patient?.phoneNumber,
        paymentreference,
        paymentype: prescriptionresponse.prescription,
        paymentcategory: pharmacy,
        patient: patient._id,
        amount:orderPrice.amount * qty,
        qty,
      });

      queryresult = await updateprescription(id, {
        dispensestatus: configuration.status[10], // dispensed
        payment: createpaymentqueryresult._id,
        remark,
        qty,
      });

      await updatepatient(patient._id, {
        $push: { payment: createpaymentqueryresult._id },
      });
    } else {
      queryresult = await updateprescription(id, {
        dispensestatus: configuration.status[13], // rejected
        remark,
      });
    }

    return queryresult;
  },
};

// ✅ HMOPharmacyOrderStrategy
export const HMOPharmacyOrderStrategy: PharmacyOrderStrategy = {
  async execute({ id, option, remark, amount,hmopercentagecover,actualcost,qty }) {
    let queryresult;
    if (option == true) {
      queryresult = await updateprescription(id, {
        dispensestatus: configuration.otherstatus[0], // approved
        amount,
        remark,
        qty,
         hmopercentagecover,
         actualcost,
      });
    } else {
      queryresult = await updateprescription(id, {
        dispensestatus: configuration.status[13], // rejected
        remark,
      });
    }
    return queryresult;
  },
};

// ✅ Context Function
export const PharmacyOrderConfirmationContext = (strategyFn: PharmacyOrderStrategy) => ({
  execute: async (args: Parameters<PharmacyOrderStrategy["execute"]>[0]) =>
    strategyFn.execute(args),
});



export async function createPrescriptionRecord({
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
}: any) {
  const actualcost = Number(orderPrice.amount) * qty;
  const amount =
    calculateAmountPaidByHMO(
      Number(hmopercentagecover),
      Number(orderPrice.amount)
    ) * qty;

  const prescription = await createprescription({
    isHMOCover: patient?.isHMOCover,
    HMOPlan: patient?.HMOPlan,
    HMOName: patient?.HMOName,
    HMOId: patient?.HMOId,
    firstName: patient?.firstName,
    lastName: patient?.lastName,
    MRN: patient?.MRN,
    dispensestatus: configuration.otherstatus[0],
    amount,
    qty,
    pharmacy,
    duration: null,
    dosageform,
    strength,
    dosage,
    frequency,
    route,
    prescription: drug,
    patient: patient._id,
    orderid,
    prescribersname: firstName + " " + lastName,
    prescriptionnote,
    appointment: appointment._id,
    appointmentid: appointment.appointmentid,
    appointmentdate: appointment?.appointmentdate,
    clinic: appointment?.clinic,
  });

  return { prescription, actualcost, amount };
}

// ✅ Step 2: Decide Strategy (HMO vs SelfPay)
export function selectPharmacyOrderStrategy(patient: any) {
  if (patient.isHMOCover == configuration.ishmo[1] || patient.isHMOCover == true) {
    return HMOPharmacyOrderStrategy;
  } else {
    return SelfPayPharmacyOrderStrategy;
  }
}