import Payment from "../models/payment";
import Admission from "../models/admission";
import Appointment from "../models/appointment";
import Clinic from "../models/clinics";
import Wardmanagement from "../models/wardmanagement";

import configuration from "../config";
export async function readpaymentaggregate(input:any) {
    try{
    return await Payment.aggregate(input);
    }
    catch(e:any){
      console.log(e);
      throw new Error(configuration.error.erroruserupdate);
    }
    }

    export async function readappointmentaggregate(input:any) {
        try{
        return await Appointment.aggregate(input);
        }
        catch(e:any){
          console.log(e);
          throw new Error(configuration.error.erroruserupdate);
        }
        }
        export async function readadmissionaggregate(input:any) {
            try{
            return await Admission.aggregate(input);
            }
            catch(e:any){
              console.log(e);
              throw new Error(configuration.error.erroruserupdate);
            }
            }


    export async function readclinicaggregate(input:any) {
        try{
        return await Clinic.aggregate(input);
        }
        catch(e:any){
          console.log(e.message);
          throw new Error(configuration.error.erroruserupdate);
        }
        }


        export async function readwardaggregate(input:any) {
            try{
            return await Wardmanagement.aggregate(input);
            }
            catch(e:any){
              console.log(e);
              throw new Error(configuration.error.erroruserupdate);
            }
            }