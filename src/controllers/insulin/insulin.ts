import {readallinsulins, createinsulins,updateinsulins} from "../../dao/insulin";
import {readoneadmission} from "../../dao/admissions";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";

// Get all lab records
export const readallinsulinByAdmission = async (req:any, res:any) => {
    try {
     const {admission} = req.params;
      const queryresult = await readallinsulins({admission},{dateandtimeofinsulinadministration:1,rbsvalue:1,typeofinsulin:1,dosage:1,route:1,staffname:1,createdAt:1,updatedAt:1},'','');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
  //get lab order by patient
  export const readAllinsulinByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {patient} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readallinsulins({patient},{dateandtimeofinsulinadministration:1,rbsvalue:1,typeofinsulin:1,dosage:1,route:1,staffname:1,createdAt:1,updatedAt:1},'','');
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
export const createinsulin = async (req:any, res:any) => {
    try {
      //dateandtimeofinsulinadministration,typeofinsulin,dosage,route,
      // rbsvalue, 
      // typeofinsulin,
      //  dosage,
      //  route,
      //  served by user profile 

      const {id} = req.params;
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      //var { dateandtimeofbloodglucosemonitoring,premealbloodglucoselevel,postmealbloodglucoselevel,fastingbloodglucose,dateandtimeofinsulinadministration,typeofinsulin,dosage,route,mealtimes,carbonhydrateintakeestimation,symtoms,interventionprovided,staffname} = req.body;
      var { dateandtimeofinsulinadministration,rbsvalue,typeofinsulin,dosage,route,staffname} = req.body;
      //validateinputfaulsyvalue({dateandtimeofbloodglucosemonitoring,premealbloodglucoselevel,postmealbloodglucoselevel,fastingbloodglucose,dateandtimeofinsulinadministration,typeofinsulin,dosage,route,mealtimes,carbonhydrateintakeestimation,symtoms,interventionprovided,staffname});
      validateinputfaulsyvalue({dateandtimeofinsulinadministration,typeofinsulin,rbsvalue,dosage,route,staffname}); 
      //frequency must inlcude
       //route must contain allowed options
      
      const admissionrecord:any =  await readoneadmission({_id:id},{},'');    
      //console.log(admissionrecord);   
      if(!admissionrecord){
           throw new Error(`Admission donot ${configuration.error.erroralreadyexit}`);
  
       }
    //const queryresult=await createinsulins({referedward:admissionrecord.referedward,admission:admissionrecord._id,patient:admissionrecord.patient,dateandtimeofbloodglucosemonitoring,premealbloodglucoselevel,postmealbloodglucoselevel,fastingbloodglucose,dateandtimeofinsulinadministration,typeofinsulin,dosage,route,mealtimes,carbonhydrateintakeestimation,symtoms,interventionprovided,staffname});
    const queryresult=await createinsulins({referedward:admissionrecord.referedward,admission:admissionrecord._id,patient:admissionrecord.patient,dateandtimeofinsulinadministration,typeofinsulin,rbsvalue,dosage,route,staffname});
    //dateandtimeofinsulinadministration,rbsvalue,typeofinsulin,dosage,route,staffname
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}


//insulin

export async function updateinsulin(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var { dateandtimeofinsulinadministration,rbsvalue,typeofinsulin,dosage,route,staffname} = req.body;
    validateinputfaulsyvalue({dateandtimeofinsulinadministration,typeofinsulin,rbsvalue,dosage,route,staffname}); 
    
    var queryresult = await updateinsulins(id, {dateandtimeofinsulinadministration,rbsvalue,typeofinsulin,dosage,route,staffname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }

  
      
  