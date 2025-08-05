import  mongoose from 'mongoose';
import { validateinputfaulsyvalue } from "../../utils/otherservices";
import {readoneappointment,updateappointment} from "../../dao/appointment";
import {createadmission,readalladmission,updateadmission,readoneadmission} from  "../../dao/admissions";
import  {updatepatient,readonepatient}  from "../../dao/patientmanagement";
import {readonewardmanagement,updatewardmanagement} from "../../dao/wardmanagement";
import {readoneclinic} from "../../dao/clinics";
import {readallpayment} from "../../dao/payment";
import {readonebed,updatebed} from "../../dao/bed";
import configuration from "../../config";
const { ObjectId } = mongoose.Types;

//refer for admission
export var referadmission= async (req:any, res:any) =>{
    try{
      
      const { firstName,lastName} = (req.user).user;
      var admissionid:any=String(Date.now());
      //accept _id from request
      const {id} = req.params;
      //doctorname,patient,appointment
      var {alldiagnosis,referedward,admittospecialization, referddate,appointmentid,bed_id} = req.body;
      validateinputfaulsyvalue({id,alldiagnosis,referedward,admittospecialization, referddate,bed_id});
      //confirm ward
      const referedwardid = new ObjectId(referedward);
      const bed = new ObjectId(bed_id);
      const foundWard:any =  await readonewardmanagement({_id:referedwardid},'');
      if(!foundWard){
          throw new Error(`Ward doesnt ${configuration.error.erroralreadyexit}`);

      }
      const foundBed = await readonebed({_id:bed, ward:foundWard._id},'');
       if(!foundBed){
          throw new Error(`Bed doesnt ${configuration.error.erroralreadyexit}`);

      }
      //validate bed status
    if (foundBed.status == configuration.bedstatus[1]) {
      throw new Error(`${foundBed.bednumber} Bed is already occupied`);
    }
      //valid that bed exist

         var appointment:any;
                if(appointmentid){
                  appointmentid = new ObjectId(appointmentid);
                  console.log("appoitmentid",appointmentid);
                  appointment = await readoneappointment({_id:appointmentid},{},'');
                   console.log("appointment",appointment);
                        if(!appointment){
                          //create an appointment
                          throw new Error(`Appointment donot ${configuration.error.erroralreadyexit}`);
            
                      }
            
            
    }
      //confrim admittospecialization
      //validate specialization
          const foundSpecilization =  await readoneclinic({clinic:admittospecialization},'');
          if(!foundSpecilization){
              throw new Error(`Specialization doesnt ${configuration.error.erroralreadyexit}`);
      
          }

     //find the record in patient and validate
    
    var patient = await readonepatient({_id:id,status:configuration.status[1]},{},'','');
      
      if(!patient){
        throw new Error(`Patient donot ${configuration.error.erroralreadyexit} or has not made payment for registration`);

      }
   
  //check that patient have not been admitted
  var  findAdmission = await readoneadmission({patient:patient._id, status:{$ne: configuration.admissionstatus[5]}},{},'');
  if(findAdmission){
    throw new Error(`Patient Admission ${configuration.error.erroralreadyexit}`);

}


//create admission
var admissionrecord:any = await createadmission({alldiagnosis,referedward,admittospecialization, referddate,doctorname:firstName + " " + lastName,appointment:id,patient:patient._id,admissionid,bed});
// Update ward and bed status simultaneously using Promise.all
await Promise.all([
  updatewardmanagement(referedwardid, { $inc: { occupiedbed: 1, vacantbed: -1 } }),
  updatebed(bed, { status: configuration.bedstatus[1] }),
  updatepatient(patient._id,{$push: {admission:admissionrecord._id}})
]);

if(appointmentid){
              await updateappointment(appointment._id,{admission:admissionrecord._id});
      
}
//create bed fee

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
        const queryresult = await readalladmission({referedward},{},'referedward','patient','bed');
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}
//get all admitted patient
// get all admission patient
export async function getalladmissionbypatient(req:any, res:any){
  try{
    
     const {patient} = req.params;
     console.log(patient);
     const referedward = new ObjectId(patient);
      const queryresult = await readalladmission({patient},{},'referedward','patient','bed');
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
  var {status, transfterto,bed_id} = req.body;
  if (transfterto) {
  transfterto = new ObjectId(transfterto);
}

if (bed_id) {
  bed_id = new ObjectId(bed_id);
}
  try{
    //validate that status is included in te status choice
    if(![ "transfered",  "discharged"].includes(status))
      throw new Error(`${status} status doesnt ${configuration.error.erroralreadyexit}`);

    //if status = discharge
    
      const response = await readoneadmission({_id:id},{},'');
      // check for availability of bed spaces in ward only for admitted
      if(!response){
          throw new Error(`Admission donot ${configuration.error.erroralreadyexit}`);
      }
      
     
      var transftertoward:any;
      var foundBed;
      console.log("transftertoward",transfterto);
     
    if(transfterto){
       console.log("insidetransftertoward",transfterto);
            transftertoward= await readonewardmanagement({_id:transfterto},{});
            foundBed=await readonebed({_id:bed_id, ward:transftertoward._id, status:configuration.bedstatus[0], isDeleted:false},'');

    }
    if(transfterto && (status != configuration.admissionstatus[3] ||  !transftertoward || !foundBed)) throw new Error(`Ward or Bed to be transfered donot  ${configuration.error.erroralreadyexit} or ${transftertoward.wardname}  ${configuration.error.errorvacantspace}`);
      
      //validate if permitted base on status
     //const status= response?.status == configuration.status[0]? configuration.status[1]: configuration.status[0];
   
      if(status == configuration.admissionstatus[5]){
        //check that the patient is not owing
        var paymentrecord:any = await readallpayment({paymentreference:response.admissionid,status:{$ne: configuration.status[3]}},'');
        if((paymentrecord.paymentdetails).length > 0){
          throw new Error(configuration.error.errorpayment);
    
        }
        //increase vancant and reduce occupied for current ward update appointment
        await Promise.all([
          updatewardmanagement(response.referedward,{$inc:{occupiedbed:-1,vacantbed:1}}),
          updatebed(response.bed,{status:configuration.bedstatus[0]}),
          updateadmission(id,{status})

        ]);
        //update bed
      }
      // status is equal to  transfer reduce target ward and increase 
      if(status == configuration.admissionstatus[3] ){
        ////increase vancant and reduce occupied for current ward use parallelism
         await Promise.all([
         
          updatewardmanagement(response.referedward,{$inc:{occupiedbed:-1,vacantbed:1}}),
          updatewardmanagement(transfterto,{$inc:{occupiedbed:1,vacantbed:-1}}),
          updatebed(response.bed,{status:configuration.bedstatus[0]}),
          updatebed(bed_id,{status:configuration.bedstatus[1]}),
          updateadmission(id,{bed:bed_id,previousward:response.referedward,referedward:transfterto}),
         ]);
      }
    const queryresult="Succefully updated the admission status"; 
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


