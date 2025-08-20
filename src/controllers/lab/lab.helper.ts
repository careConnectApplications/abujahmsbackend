// strategies/labConfirmation.ts
import configuration from "../../config";
import {readoneadmission} from  "../../dao/admissions";
import {createpayment} from "../../dao/payment";
import {updatelab} from "../../dao/lab";
import  {updatepatient}  from "../../dao/patientmanagement";
import { getPaymentReference } from "../../utils/otherservices";

// Define the type for the strategy function
type LabConfirmationStrategy = (args: {
  id: string;
  option: boolean;
  remark: string;
  lab?: any;     // you can replace `any` with your Lab type
  patient?: any; // replace with your Patient type
}) => Promise<any>;
export const  SelfPayLabConfirmationStrategy = async (
  { id, option, remark, lab, patient }:any
) => {
 
  let queryresult;
  //let paymentreference;
  const paymentreference = await getPaymentReference(patient._id, lab.testid);
  if (option && lab.amount > 0) {
    const createpaymentqueryresult = await createpayment({
      firstName: patient?.firstName,
      lastName: patient?.lastName,
      MRN: patient?.MRN, 
      phoneNumber: patient?.phoneNumber,
      paymentreference,
      paymentype: lab.testname,
      paymentcategory: configuration.category[2],
      patient: patient._id,
      amount: lab.amount
    });

    queryresult = await updatelab(
      { _id: id },
      {
        status: configuration.status[2],
        payment: createpaymentqueryresult._id,
        remark
      }
    );

    await updatepatient(patient._id, {
      $push: { payment: createpaymentqueryresult._id }
    });
  } else if (option && lab.amount === 0) {
    queryresult = await updatelab(
      { _id: id },
      { status: configuration.status[5], remark }
    );
  }

  return queryresult;
};

export const HmoLabConfirmationStrategy = async (
  { id, option, remark }:any
) => {
  if (option) {
    return await updatelab(
      { _id: id },
      { status: configuration.otherstatus[0], remark }
    );
  } else {
    return await updatelab(
      { _id: id },
      { status: configuration.status[13], remark }
    );
  }
};


// context/labConfirmationContext.ts
// Context wrapper with proper typing
export const LabConfirmationContext = (strategyFn: LabConfirmationStrategy) => ({
  execute: async (args: Parameters<LabConfirmationStrategy>[0]) =>
    strategyFn(args),
});
