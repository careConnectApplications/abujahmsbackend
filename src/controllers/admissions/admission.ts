import { validateinputfaulsyvalue } from "../../utils/otherservices";
import {readoneappointment,} from "../../dao/appointment";
import {createadmission} from  "../../dao/admissions";
import  {updatepatient}  from "../../dao/patientmanagement";
import configuration from "../../config";

//pharmacy order
export var referadmission= async (req:any, res:any) =>{
    try{
      
      const { firstName,lastName} = (req.user).user;
      //accept _id from request
      const {id} = req.params;
      //doctorname,patient,appointment
      const {alldiagnosis,referedward,admittospecialization, referddate} = req.body;
      validateinputfaulsyvalue({id,alldiagnosis,referedward,admittospecialization, referddate});
      
      //confirm ward
      //confrim admittospecialization

     //find the record in appointment and validate
    var appointment = await readoneappointment({_id:id},{},'');
    if(!appointment){
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
// update admission status
