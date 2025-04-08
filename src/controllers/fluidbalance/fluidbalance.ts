import {readallfluidbalances, createfluidbalances,updatefluidbalances} from "../../dao/fluidbalance";
import {readoneadmission} from "../../dao/admissions";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";

// Get all lab records
export const readallfluidbalanceByAdmission = async (req:any, res:any) => {
    try {
     const {admission} = req.params;
      const queryresult = await readallfluidbalances({admission},{},'patient','admission');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
  //get lab order by patient
  export const readAllfluidbalanceByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {patient} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readallfluidbalances({patient},{},'patient','admission');
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
export const createfluidbalance = async (req:any, res:any) => {
    try {
      const {id} = req.params;
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      
      var { oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname} = req.body;
      validateinputfaulsyvalue({oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname});
       //frequency must inlcude
       //route must contain allowed options
      
      const admissionrecord:any =  await readoneadmission({_id:id},{},'');    
      //console.log(admissionrecord);   
      if(!admissionrecord){
           throw new Error(`Admission donot ${configuration.error.erroralreadyexit}`);
  
       }
    const queryresult=await createfluidbalances({referedward:admissionrecord.referedward,admission:admissionrecord._id,patient:admissionrecord.patient,oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}


//insulin

export async function updatefluidbalance(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var { oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname} = req.body;
    validateinputfaulsyvalue({oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname});
    
    var queryresult = await updatefluidbalances(id, {oralfluids,tubefeedingvolume,IVfluidtype,IVfluidvolume,IVfluidrate,medication,urineoutput,stoolfrequency,consistency,stoolamount,vomitamount,drainage,totalintake,totaloutput,netfliudbalancefor24hours,staffname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }

  
      
  