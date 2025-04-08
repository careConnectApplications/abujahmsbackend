import {readalltubefeedingcharts, createtubefeedingcharts,updatetubefeedingcharts} from "../../dao/tubefeedingchart";
import {readoneadmission} from "../../dao/admissions";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";

// Get all lab records
export const readalltubefeedingchartByAdmission = async (req:any, res:any) => {
    try {
     const {admission} = req.params;
      const queryresult = await readalltubefeedingcharts({admission},{},'patient','admission');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
  //get lab order by patient
  export const readAlltubefeedingchartByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {patient} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readalltubefeedingcharts({patient},{},'patient','admission');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };


export const createtubefeedingchart = async (req:any, res:any) => {
    try {
      const {id} = req.params;
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      var { Datetimefeeds,amount,sign,staffname} = req.body;
      validateinputfaulsyvalue({Datetimefeeds,amount,sign,staffname}); 
      const admissionrecord:any =  await readoneadmission({_id:id},{},'');    
      console.log(admissionrecord);   
      if(!admissionrecord){
           throw new Error(`Admission donot ${configuration.error.erroralreadyexit}`);
  
       }
    const queryresult=await createtubefeedingcharts({referedward:admissionrecord.referedward,admission:admissionrecord._id,patient:admissionrecord.patient,Datetimefeeds,amount,sign,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}
//update vitalcharts
export async function updatetubefeedingchart(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var { Datetimefeeds,amount,sign,staffname} = req.body;
    validateinputfaulsyvalue({Datetimefeeds,amount,sign,staffname});

    var queryresult = await updatetubefeedingcharts(id, {Datetimefeeds,amount,sign,staffname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }

  
      
  