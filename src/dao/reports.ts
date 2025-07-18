import Payment from "../models/payment";
import Admission from "../models/admission";
import Appointment from "../models/appointment";
import Clinic from "../models/clinics";
import Wardmanagement from "../models/wardmanagement";
import Hmomanagement from "../models/hmomanagement";
import Procedure from "../models/procedure";
import Lab from "../models/lab";
import Radiology from "../models/radiology";
import Prescription from "../models/prescription";
import Patientsmanagement from "../models/patientmanagement";
import Nutrition from "../models/nutrition";
import configuration from "../config";
import Immunization from "../models/immunization";
export async function readpatientsmanagementaggregate(input:any) {
  try{
  return await Patientsmanagement.aggregate(input);
  }
  catch(e:any){
    console.log(e);
    throw new Error(configuration.error.erroruserupdate);
  }
  }
export async function readpaymentaggregate(input:any) {
    try{
    return await Payment.aggregate(input);
    }
    catch(e:any){
      console.log(e);
      throw new Error(configuration.error.erroruserupdate);
    }
    }

    export async function readhmoaggregate(input:any) {
      try{
      return await Hmomanagement.aggregate(input);
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
            export async function readprocedureaggregate(input:any) {
              try{
              return await Procedure.aggregate(input);
              }
              catch(e:any){
                console.log(e);
                throw new Error(configuration.error.erroruserupdate);
              }
              }

              //  lab aggregate
              
              export async function readlabaggregate(input:any) {
                try{
                return await Lab.aggregate(input);
                }
                catch(e:any){
                  console.log(e);
                  throw new Error(configuration.error.erroruserupdate);
                }
                }

                //radiology
                export async function readradiologyaggregate(input:any) {
                  try{
                  return await Radiology.aggregate(input);
                  }
                  catch(e:any){
                    console.log(e);
                    throw new Error(configuration.error.erroruserupdate);
                  }
                  }
                  
                  //Prescription
                  export async function readprescriptionaggregate(input:any) {
                    try{
                    return await Prescription.aggregate(input);
                    }
                    catch(e:any){
                      console.log(e);
                      throw new Error(configuration.error.erroruserupdate);
                    }
                    }

                    //nutrition
                      export async function readnutritionaggregate(input:any) {
                    try{
                    return await Nutrition.aggregate(input);
                    }
                    catch(e:any){
                      console.log(e);
                      throw new Error(configuration.error.erroruserupdate);
                    }
                    }
                    //immunization
              export async function readimmunizationaggregate(input:any) 
              {
                  try{
                      return await Immunization.aggregate(input)
                  }
                  catch(e:any){
                      console.log(e);
                      throw new Error(configuration.error.erroruserupdate);
                  }
              }