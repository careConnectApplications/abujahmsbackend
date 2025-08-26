import { types } from "util";
import configuration from "../../config";
import  {readallclinics,createclinic,readoneclinic,updateclinic}  from "../../dao/clinics";
import { validateinputfaulsyvalue,generateRandomNumber} from "../../utils/otherservices";
import {createaudit} from "../../dao/audit";
import clinic from "../../models/clinics";
//add patiient
export var createclinics = async (req:any,res:any) =>{
   
    try{
   
       const {clinic,type,category} = req.body;
       const { firstName, lastName } = (req.user).user;
       var actor = `${firstName} ${lastName}`;
       validateinputfaulsyvalue({clinic,type,category});
       var id = `${clinic[0]}${generateRandomNumber(5)}${clinic[clinic.length -1]}`;
        const foundClinic =  await readoneclinic({clinic},'');
        //update servicetype for New Patient Registration
        if(foundClinic){
            throw new Error(`clinic already exists`);

        }
         const queryresult=await createclinic({clinic,type,id,category});
         //create audit log
       
         await createaudit({action:"Created Clinic/Department/Pharmacy",actor,affectedentity:clinic});
        res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}

//read all patients
export async function getallclinic(req:Request, res:any){
    try{
       
        const queryresult = await readallclinics({},'');
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}
//get only clinics
//read all patients
export async function getonlyclinic(req:Request, res:any){
  try{
     
      const queryresult = await readallclinics({type:configuration.clinictype[1]},'');
      res.status(200).json({
          queryresult,
          status:true
        }); 

  }
  catch(e:any){
      res.status(403).json({status: false, msg:e.message});

  }

}


//update a price
export async function updateclinics(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const {clinic,type,category} = req.body;
    const { firstName, lastName } = (req.user).user;
    var actor = `${firstName} ${lastName}`;
    validateinputfaulsyvalue({clinic,id, type,category});
    var queryresult = await updateclinic(id, {clinic, type,category});
    await createaudit({action:"Update Clinic/Department/Pharmacy",actor,affectedentity:clinic});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }
  
