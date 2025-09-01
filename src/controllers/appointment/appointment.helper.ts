
import {FreeAppointmentArgs,PaidAppointmentStrategyParams} from "./appointment.types"
// strategies/paymentStrategies.ts
export const FreeAppointmentStrategy = async ({ patientrecord, appointmentid, req, configuration, services, amount }:FreeAppointmentArgs) => {
  const { createvitalcharts, createappointment, updatepatient } = services;
  let vitals = await createvitalcharts({ status: configuration.status[8], patient: patientrecord._id });
  let appointment = await createappointment({
    ...req.body,
    appointmentid,
    patient: patientrecord._id,
    vitals: vitals._id,
    firstName: patientrecord.firstName,
    lastName: patientrecord.lastName,
    MRN: patientrecord.MRN,
    HMOId: patientrecord.HMOId,
    HMOName: patientrecord.HMOName,
    amount:amount
  });
  await updatepatient(patientrecord._id, { $push: { appointment: appointment._id } });
  return appointment;
};

export const PaidAppointmentStrategy = async ({ patientrecord, appointmentid, req, amount, configuration, services }:PaidAppointmentStrategyParams) => {
    console.log("req",req.body);
    const { createpayment, createvitalcharts, createappointment, updatepatient } = services;
    let payment = await createpayment({
    firstName: patientrecord.firstName,
    lastName: patientrecord.lastName,
    MRN: patientrecord.MRN,
    phoneNumber: patientrecord.phoneNumber,
    paymentreference: appointmentid,
    paymentype: req.body.appointmenttype,
    paymentcategory: req.body.appointmentcategory,
    patient: patientrecord._id,
    amount,
  });
  let vitals = await createvitalcharts({ status: configuration.status[8], patient: patientrecord._id });
  let appointment = await createappointment({
    ...req.body,
    appointmentid,
    payment: payment._id,
    patient: patientrecord._id,
    vitals: vitals._id,
    firstName: patientrecord.firstName,
    lastName: patientrecord.lastName,
    MRN: patientrecord.MRN,
    HMOId: patientrecord.HMOId,
    HMOName: patientrecord.HMOName,
    amount
  });
  await updatepatient(patientrecord._id, { $push: { payment: payment._id, appointment: appointment._id } });
  return appointment;
};

// strategies/context.ts
export const AppointmentContext = (strategyFn:any) => ({
  execute: async (args:any) => strategyFn(args),
});
