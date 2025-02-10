import  mongoose from 'mongoose';

import { validateinputfaulsyvalue } from "../../utils/otherservices";
import {readoneappointment,} from "../../dao/appointment";
import {createadmission,readalladmission,updateadmission,readoneadmission} from  "../../dao/admissions";
import  {updatepatient}  from "../../dao/patientmanagement";
import {readonewardmanagement,updatewardmanagement} from "../../dao/wardmanagement";
import {readoneclinic} from "../../dao/clinics";
import configuration from "../../config";
const { ObjectId } = mongoose.Types;

//refer for admission
export var referadmission= async (req:any, res:any) =>{
    try{
      
      const { firstName,lastName} = (req.user).user;
      //accept _id from request
      const {id} = req.params;
      //doctorname,patient,appointment
      const {alldiagnosis,referedward,admittospecialization, referddate} = req.body;
      validateinputfaulsyvalue({id,alldiagnosis,referedward,admittospecialization, referddate});
      //confirm ward
      const referedwardid = new ObjectId(referedward);
      const foundWard =  await readonewardmanagement({_id:referedwardid},'');
      if(!foundWard){
          throw new Error(`Ward doesnt ${configuration.error.erroralreadyexit}`);

      }
      //confrim admittospecialization
      //validate specialization
          const foundSpecilization =  await readoneclinic({clinic:admittospecialization},'');
          if(!foundSpecilization){
              throw new Error(`Specialization doesnt ${configuration.error.erroralreadyexit}`);
      
          }

     //find the record in appointment and validate
    var appointment = await readoneappointment({_id:id},{},'');
    if(!appointment){
      throw new Error(`Appointment donot ${configuration.error.erroralreadyexit}`);

  }
  //check that patient have not been admitted
  var  findAdmission = await readoneadmission({patient:appointment.patient, status:configuration.admissionstatus[5]},{},'');
  if(!findAdmission){
    throw new Error(`Appointment donot ${configuration.error.erroralreadyexit}`);

}
//create admission
var admissionrecord:any = await createadmission({alldiagnosis,referedward,admittospecialization, referddate,doctorname:firstName + " " + lastName,appointment:id,patient:appointment.patient});
//update patient 
var queryresult=await updatepatient(appointment.patient,{$push: {admission:admissionrecord._id}});
res.status(200).json({queryresult:admissionrecord, status: true});
    }
    
    catch(error:any){
      res.status(403).json({ status: false, msg: error.message });
  
    }
  
  }
// get all admission patient
export async function getallreferedforadmission(req:any, res:any){
    try{
       const {ward} = req.params;
       const referedward = new ObjectId(ward);
        const queryresult = await readalladmission({referedward},{},'referedward','patient');
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}
//admited,to transfer,transfer,to discharge, discharge
export async function updateadmissionstatus(req:any, res:any){
  const {id} = req.params;
  const {status} = req.body;
  try{
    //validate that status is included in the status choice
    if(!(configuration.admissionstatus).includes(status))
      throw new Error(`${status} status doesnt ${configuration.error.erroralreadyexit}`);

    //if status = discharge
    
      const response = await readoneadmission({_id:id},{},'');
      // check for availability of bed spaces in ward
      var ward:any = await readonewardmanagement({_id:response?.referedward},{});
      if(ward.vacantbed <= 1){
        throw new Error(`${ward.wardname}  ${configuration.error.errorvacantspace}`);

      }
      
      //validate if permitted base on status
     //const status= response?.status == configuration.status[0]? configuration.status[1]: configuration.status[0];
      const queryresult:any =await updateadmission(id,{status});
      //if status is equal to admit reduce  ward count
      if(status == configuration.admissionstatus[1]){        
        await updatewardmanagement(queryresult.referedward,{$inc:{occupiedbed:1,vacantbed:-1}});
      }
      // status is equal to  transfer reduce target ward and increase source ward
      else if(status == configuration.admissionstatus[3]){

      }
      //if status is equal to discharge, increase ward by one
      if(status == configuration.admissionstatus[5]){
        await updatewardmanagement(queryresult.referedward,{$inc:{occupiedbed:1,vacantbed:1}});

      }

      res.status(200).json({
          queryresult,
          status:true
        }); 

  }
  catch(e:any){
      console.log(e);
    res.status(403).json({status: false, msg:e.message});

  }

}


