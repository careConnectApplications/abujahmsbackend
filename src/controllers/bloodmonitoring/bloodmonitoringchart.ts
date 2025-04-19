import {readallbloodmonitoring, createbloodmonitoring,updatebloodmonitoring} from "../../dao/bloodmonitoring";
import {readoneadmission} from "../../dao/admissions";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";

// Get all lab records
export const readallbloodmonitoringByAdmission = async (req:any, res:any) => {
    try {
     const {admission} = req.params;
      const queryresult = await readallbloodmonitoring({admission},{},'patient','admission');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
  //get lab order by patient
  export const readAllbloodmonitoringByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {patient} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readallbloodmonitoring({patient},{},'patient','admission');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };

  //create vital charts
  // Create a new schedule
export const createbloodmonitorings = async (req:any, res:any) => {
    try {
      const {id} = req.params;
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      
      //blood sugar monitoring chart (contents: Date, Time, Test Type (drop down, RBS FBS), Value (mmol/l) , done by user acct.
      var { typeoftestRBSFBS,value,staffname} = req.body;
      validateinputfaulsyvalue({typeoftestRBSFBS,value,staffname});
       //frequency must inlcude
       //route must contain allowed options
      
      const admissionrecord:any =  await readoneadmission({_id:id},{},'');    
      //console.log(admissionrecord);   
      if(!admissionrecord){
           throw new Error(`Admission donot ${configuration.error.erroralreadyexit}`);
  
       }
    const queryresult=await createbloodmonitoring({referedward:admissionrecord.referedward,admission:admissionrecord._id,patient:admissionrecord.patient,typeoftestRBSFBS,value,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}


//insulin

export async function updatebloodmonitorings(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var { typeoftestRBSFBS,value,staffname} = req.body;
    validateinputfaulsyvalue({typeoftestRBSFBS,value,staffname});
    
    var queryresult = await updatebloodmonitoring(id, {typeoftestRBSFBS,value,staffname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }

  
      
  