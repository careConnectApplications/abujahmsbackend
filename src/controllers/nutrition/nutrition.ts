import {readallnutrition,createnutrition,updatenutrition} from "../../dao/nutrition";
import {readonepatient} from "../../dao/patientmanagement";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";
  export const readAllnutritionByPatient = async (req:any, res:any) => {
    try {
      const {patient} = req.params;
      const queryresult = await readallnutrition({patient},{},'patient');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };

  
export const createnutritions = async (req:any, res:any) => {
    try {
      const {id} = req.params;
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      var { date,ageinmonths,typeofvisit,infactandyoungchildfeeding,complementaryfeeding,counsellingprovided,referedtosupportgroup,anthropometryheight,anthropometryweight,anthropometrybilateraloedema,muacred,muacyellow,muacgreen,growthaccordingtothechildhealthcard,vitaminasupplement,deworming,staffname} = req.body;
      validateinputfaulsyvalue({date,ageinmonths,typeofvisit,infactandyoungchildfeeding,complementaryfeeding,counsellingprovided,referedtosupportgroup,anthropometryheight,anthropometryweight,anthropometrybilateraloedema,muacred,muacyellow,muacgreen,growthaccordingtothechildhealthcard,vitaminasupplement,deworming,staffname});  
      const patientrecord:any =  await readonepatient({_id:id},{},'','');    
      //console.log(admissionrecord);   
      if(!patientrecord){
           throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);
  
       }
    const queryresult=await createnutrition({patient:patientrecord._id,date,ageinmonths,typeofvisit,infactandyoungchildfeeding,complementaryfeeding,counsellingprovided,referedtosupportgroup,anthropometryheight,anthropometryweight,anthropometrybilateraloedema,muacred,muacyellow,muacgreen,growthaccordingtothechildhealthcard,vitaminasupplement,deworming,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}


//insulin

export async function updatenutritions(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var { date,ageinmonths,typeofvisit,infactandyoungchildfeeding,complementaryfeeding,counsellingprovided,referedtosupportgroup,anthropometryheight,anthropometryweight,anthropometrybilateraloedema,muacred,muacyellow,muacgreen,growthaccordingtothechildhealthcard,vitaminasupplement,deworming,staffname} = req.body;
    validateinputfaulsyvalue({date,ageinmonths,typeofvisit,infactandyoungchildfeeding,complementaryfeeding,counsellingprovided,referedtosupportgroup,anthropometryheight,anthropometryweight,anthropometrybilateraloedema,muacred,muacyellow,muacgreen,growthaccordingtothechildhealthcard,vitaminasupplement,deworming,staffname});
    
    var queryresult = await updatenutrition(id, {date,ageinmonths,typeofvisit,infactandyoungchildfeeding,complementaryfeeding,counsellingprovided,referedtosupportgroup,anthropometryheight,anthropometryweight,anthropometrybilateraloedema,muacred,muacyellow,muacgreen,growthaccordingtothechildhealthcard,vitaminasupplement,deworming,staffname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }

  
      
  