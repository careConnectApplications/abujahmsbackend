
import {FreeAppointmentArgs,PaidAppointmentStrategyParams} from "./appointment.types"
import {createInsuranceClaim} from "../../dao/insuranceclaim";
import configuration from "../../config";

// Helper function to build insurance claim
function buildInsuranceClaim({ patient, serviceCategory, entityId, entityKey, authorizationCode, approvalCode, amount, createdBy, action }: any) {
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
    action
  };
}

// strategies/paymentStrategies.ts
export const FreeAppointmentStrategy = async ({ patientrecord, appointmentid, req, configuration, services, amount, hmopercentagecover, appointmentPrice, createdBy }:FreeAppointmentArgs) => {
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
  
  // Create insurance claim for HMO patients
  if (hmopercentagecover && hmopercentagecover > 0) {
    const insuranceClaim = buildInsuranceClaim({
      patient: patientrecord,
      serviceCategory: configuration.category[0], // Appointment category
      entityId: appointment._id,
      entityKey: "appointment",
      authorizationCode: "",
      approvalCode: "",
      amount,
      createdBy: createdBy,
      action: "approve",
       actualcost: appointmentPrice?.amount
    });
    await createInsuranceClaim(insuranceClaim);
  }
  
  return appointment;
};

export const PaidAppointmentStrategy = async ({ patientrecord, appointmentid, req, amount, configuration, services, hmopercentagecover, appointmentPrice, createdBy }:PaidAppointmentStrategyParams) => {
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
  
  // Create insurance claim for HMO patients
  if (hmopercentagecover && hmopercentagecover > 0) {
    const insuranceClaim = buildInsuranceClaim({
      patient: patientrecord,
      serviceCategory: configuration.category[0], // Appointment category
      entityId: appointment._id,
      entityKey: "appointment",
      authorizationCode: "",
      approvalCode: "",
      amount,
      createdBy: createdBy,
      action: "approve",
      actualcost: appointmentPrice?.amount
    });
    await createInsuranceClaim(insuranceClaim);
  }
  
  return appointment;
};

// strategies/context.ts
export const AppointmentContext = (strategyFn:any) => ({
  execute: async (args:any) => strategyFn(args),
});
