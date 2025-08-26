import Patient from "../models/patientmanagementachieve";
import {patientinterface} from '../models/patientmanagement'
import {encrypt} from "../utils/otherservices";
import configuration from "../config";

  
  export async function createpatientachieve(input:any){
    try{
       return  Patient.insertMany(input);
        
    }
    catch(err){
      console.log(err);
      throw new Error("Failed to create patient archive");

    }
  }
 