import {readallvitalcharts, createvitalcharts,updatevitalcharts} from "../../dao/vitalcharts";
import {readoneadmission} from "../../dao/admissions";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import  {readonepatient}  from "../../dao/patientmanagement";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";

// Get all lab records
export const readallvitalchartByAdmission = async (req:any, res:any) => {
    try {
     const {admission} = req.params;
      const queryresult = await readallvitalcharts({admission},{},'patient','admission');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
  //get lab order by patient
  export const readAllvitalsByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {patient} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readallvitalcharts({patient},{},'patient','admission');
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
export const createvitalchart = async (req:any, res:any) => {
    try {
        
       // admission,patient,height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,bmi,painscore,rbs,gcs,wardname,staffname,
      
     
      const {id} = req.params;
    
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      var { height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,painscore,rbs,gcs,staffname} = req.body;
      validateinputfaulsyvalue({height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,painscore,rbs,gcs,staffname});
      var bmi = weight/((height/100) * (height/100));
      const foundPatient:any =  await readonepatient({_id:id},{},'','');
      var admissionrecord:any;
    if(foundPatient){
      admissionrecord={
        patient:id,
        referedward:new ObjectId(),
        _id:new ObjectId(),
        
      }
    }
      else{
        admissionrecord =  await readoneadmission({_id:id},{},'');    
      if(!admissionrecord){
           throw new Error(`Admission donot ${configuration.error.erroralreadyexit}`);
  
       }

      }
      
    const queryresult=await createvitalcharts({referedward:admissionrecord.referedward,admission:admissionrecord._id,patient:admissionrecord.patient,bmi,height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,painscore,rbs,gcs,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}
//update vitalcharts
export async function updatevitalchart(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var { height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,painscore,rbs,gcs,staffname} = req.body;
    //validateinputfaulsyvalue({height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,staffname});
    var bmi;
    if(height && weight) bmi = weight/((height/100) * (height/100));
    var queryresult = await updatevitalcharts(id, {bmi,height,weight,temperature,heartrate,bloodpressuresystolic,bloodpressurediastolic,respiration,saturation,painscore,rbs,gcs,staffname,status:configuration.status[6]});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }

  

  
      
  