import Patient from "../models/patientmanagement";
import {patientinterface} from '../models/patientmanagement'
import {encrypt} from "../utils/otherservices";
import configuration from "../config";

  //read all patient history
  export async function readallpatient(query:any) {
    try {
      const patientdetails = await Patient.find(query).select({"title":1,"firstName":1,"middleName":1,"lastName":1,"country":1, "stateOfResidence": 1,"LGA": 1,"address":1,"age":1,"dateOfBirth":1,"gender":1,"nin":1,"phoneNumber":1,"email":1,"oldMRN":1,"nextOfKinName":1,"nextOfKinRelatinship":1,"nextOfKinPhoneNumber":1,"nextOfKinAddress":1,
    "maritalStatus":1, "disability":1,"occupation":1,"isHMOCover":1,"HMOName":1,"HMOId":1,"HMOPlan":1,"MRN":1});
      const totalpatientdetails = await Patient.countDocuments();
      return { patientdetails, totalpatientdetails };
    } catch (err) {
      console.log(err);
      throw new Error(configuration.error.erroruserread);
    }
  };
  export async function createpatient(input:patientinterface){
    try{
       const user = new Patient(input);
        return await user.save();
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.errorusercreate);

    }
  }
  //find one
  export async function readonepatient(query:any){
    try{
    return await Patient.findOne(query).select({"title":1,"firstName":1,"middleName":1,"lastName":1,"country":1, "stateOfResidence": 1,"LGA": 1,"address":1,"age":1,"dateOfBirth":1,"gender":1,"nin":1,"phoneNumber":1,"email":1,"oldMRN":1,"nextOfKinName":1,"nextOfKinRelatinship":1,"nextOfKinPhoneNumber":1,"nextOfKinAddress":1,
        "maritalStatus":1, "disability":1,"occupation":1,"isHMOCover":1,"HMOName":1,"HMOId":1,"HMOPlan":1,"MRN":1});
    }
    catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserread);

    }
  }
  
 
  
  //update  users
  export async function updatepatient(id:any, reqbody:any){
    try{
      if (reqbody.password) {
        const passwordHash = await encrypt(reqbody.password);
        //re-assign hasshed version of original
        reqbody.password = passwordHash;
      }
    const user = await Patient.findOneAndUpdate({ _id: id }, reqbody,{
      new: true
    });
      if (!user) {
        //return json  false response
        throw new Error(configuration.error.errorinvalidcredentials);
      }
      return user;
    }catch(err){
      console.log(err);
      throw new Error(configuration.error.erroruserupdate);

    }

  }
  