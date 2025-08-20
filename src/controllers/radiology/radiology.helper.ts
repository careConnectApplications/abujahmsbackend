import configuration from "../../config";
import {readoneadmission} from  "../../dao/admissions";
import {createpayment} from "../../dao/payment";
import {updateradiology} from "../../dao/radiology";
import  {updatepatient}  from "../../dao/patientmanagement";
import { getPaymentReference } from "../../utils/otherservices";

type RadiologyConfirmationArgs = {
  id: string;
  option: boolean;
  remark: string;
  radiology?: any;  // or better: RadiologyModel if you have a type
  patient?: any;    // or PatientModel
};

type RadiologyStrategyFn = (args: RadiologyConfirmationArgs) => Promise<any>;
export const RadiologyConfirmationContext = (strategyFn: RadiologyStrategyFn) => ({
  execute: async (args: RadiologyConfirmationArgs) => strategyFn(args),
});



export const HmoRadiologyConfirmationStrategy = async ({ id, option, remark, radiology }:any) => {
  let queryresult;

  if (option === true) {
    // HMO patient → mark as approved without payment
    queryresult = await updateradiology(
      { _id: id },
      { status: configuration.otherstatus[0], remark }
    );
  } else {
    // Rejected
    queryresult = await updateradiology(
      { _id: id },
      { status: configuration.status[13], remark }
    );
  }

  return queryresult;
};
 

export const SelfPayRadiologyConfirmationStrategy = async ({ id, option, remark, radiology, patient }:any) => {
  let queryresult;
  const { testname, testid, amount } = radiology;
  // Decide payment reference
  const paymentreference = await getPaymentReference(patient._id, testid);
  if (option === true) {
    if (amount > 0) {
      const payment = await createpayment({
        firstName: patient?.firstName,
        lastName: patient?.lastName,
        MRN: patient?.MRN,
        phoneNumber: patient?.phoneNumber,
        paymentreference,
        paymentype: testname,
        paymentcategory: configuration.category[4],
        patient,
        amount,
      });

      queryresult = await updateradiology(
        { _id: id },
        { status: configuration.status[9], payment: payment._id, remark }
      );

      await updatepatient(patient, { $push: { payment: payment._id } });
    } else {
      // amount == 0
      queryresult = await updateradiology(
        { _id: id },
        { status: configuration.status[9], remark }
      );
    }
  } else {
    // Rejected
    queryresult = await updateradiology(
      { _id: id },
      { status: configuration.status[13], remark }
    );
  }

  return queryresult;
};
