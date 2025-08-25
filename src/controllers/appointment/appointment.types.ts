import { Document } from "mongoose";
// types/appointment.ts
export interface PatientRecord {
  _id: string;
  firstName: string;
  lastName: string;
  MRN: string;
  HMOId?: string;
  HMOName?: string;
  phoneNumber?: string;
}

export interface AppointmentReq {
  clinic: string;
  reason: string;
  appointmentdate: string;
  appointmentcategory: string;
  appointmenttype: string;
  patient: string;
  [key: string]: any;
}

export interface Services {
  createvitalcharts: (data: any) => Promise<any>;
  createappointment: (data: any) => Promise<any>;
  updatepatient: (id: string, update: any) => Promise<any>;
}

export interface FreeAppointmentArgs {
  patientrecord: PatientRecord;
  appointmentid: string;
  req: AppointmentReq;
  configuration: any; // or make a stricter enum type if you want
  services: Services;
}
export interface PaidAppointmentStrategyParams {
  patientrecord: PatientRecord;
  appointmentid: string;
  req: any;
  configuration: any;
  services: {
    createvitalcharts: (data: any) => Promise<any>;
    createappointment: (data: any) => Promise<any>;
    createpayment: (data: any) => Promise<any>;
    updatepatient: (id: string, update: any) => Promise<any>;
  };
  amount: number;
}

