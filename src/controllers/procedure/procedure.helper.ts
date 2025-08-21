import {  createprocedure} from "../../dao/procedure";
import { readoneprice } from "../../dao/price";
import { readoneadmission } from "../../dao/admissions";
import { updateappointment } from "../../dao/appointment";
import { updatepatient } from "../../dao/patientmanagement";
import { calculateAmountPaidByHMO } from "../../utils/otherservices";
import { createpayment } from "../../dao/payment";
import { getPaymentReference } from "../../utils/otherservices";
import configuration from "../../config";


type ProcedureArgs = {
  id: string;
  procedure: string[];
  clinic: string;
  indicationdiagnosisprocedure: string;
  appointmentdate: Date;
  cptcodes: string[];
  dxcodes: string[];
  appointmentid?: string;
  raiseby: string;
  procedureid: string;
  foundPatient: any;
  hmopercentagecover: number;
};

type ProcedureStrategyFn = (args: ProcedureArgs) => Promise<any>;

export const ProcedureScheduleContext = (strategyFn: ProcedureStrategyFn) => ({
  execute: async (args: ProcedureArgs) => strategyFn(args),
});

export const SelfPayProcedureStrategy: ProcedureStrategyFn = async ({
  id,
  procedure,
  clinic,
  indicationdiagnosisprocedure,
  appointmentdate,
  cptcodes,
  dxcodes,
  appointmentid,
  raiseby,
  procedureid,
  foundPatient,
  hmopercentagecover,
}) => {
  const proceduresid: any[] = [];
  const paymentids: any[] = [];

  for (let i = 0; i < procedure.length; i++) {
    const testPrice: any = await readoneprice({ servicetype: procedure[i] });
    if (!testPrice) {
      throw new Error(`${configuration.error.errornopriceset} ${procedure[i]}`);
    }

    // decide payment reference
      const paymentreference = await getPaymentReference(id, procedureid);
    // create payment
    const createpaymentqueryresult = await createpayment({
      firstName: foundPatient?.firstName,
      lastName: foundPatient?.lastName,
      MRN: foundPatient?.MRN,
      phoneNumber: foundPatient?.phoneNumber,
      paymentreference,
      paymentype: procedure[i],
      paymentcategory: configuration.category[5],
      patient: id,
      amount: Number(testPrice.amount),
    });

    // create procedure record
    const procedurerecord = await createprocedure({
      procedure: procedure[i],
      patient: id,
      payment: createpaymentqueryresult._id,
      procedureid,
      clinic,
      indicationdiagnosisprocedure,
      appointmentdate,
      cptcodes,
      dxcodes,
      raiseby,
    });

    proceduresid.push(procedurerecord._id);
    paymentids.push(createpaymentqueryresult._id);
  }

  // update patient with procedures + payments
  let queryresult = await updatepatient(id, { $push: { prcedure: proceduresid, payment: paymentids } });

  // link to appointment
  if (appointmentid) {
    await updateappointment(appointmentid, { $push: { procedure: proceduresid } });
  }

  return queryresult;
};
export const HmoProcedureStrategy: ProcedureStrategyFn = async ({
  id,
  procedure,
  clinic,
  indicationdiagnosisprocedure,
  appointmentdate,
  cptcodes,
  dxcodes,
  appointmentid,
  raiseby,
  procedureid,
  hmopercentagecover,
}) => {
  const proceduresid: any[] = [];

  for (let i = 0; i < procedure.length; i++) {
    const testPrice: any = await readoneprice({ servicetype: procedure[i] });
    if (!testPrice) {
      throw new Error(`${configuration.error.errornopriceset} ${procedure[i]}`);
    }

    const amount = calculateAmountPaidByHMO(Number(hmopercentagecover), Number(testPrice.amount));

    const procedurerecord = await createprocedure({
      procedure: procedure[i],
      patient: id,
      procedureid,
      clinic,
      indicationdiagnosisprocedure,
      appointmentdate,
      cptcodes,
      dxcodes,
      hmopercentagecover,
      actualcost:Number(testPrice.amount),
      raiseby,
      status: configuration.otherstatus[0],
      amount,
    });

    proceduresid.push(procedurerecord._id);
  }

  // update patient with procedures only
  let queryresult = await updatepatient(id, { $push: { prcedure: proceduresid } });

  // link to appointment
  if (appointmentid) {
    await updateappointment(appointmentid, { $push: { procedure: proceduresid } });
  }

  return queryresult;
};
