import {readallpathograph,createpathograph,updatepathograph} from "../../dao/pathograph";
import {readonepatient} from "../../dao/patientmanagement";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";

  //get lab order by patient
  export const readAllpathographByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {patient} = req.params;
      const queryresult = await readallpathograph({patient},{},'patient');
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
export const createpathographs = async (req:any, res:any) => {
    try {
      const {id} = req.params;
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      

      var { selectdate,temperature,pulse,bloodpressuresystolic,bloodpressurediastolic,respiratoryrate,foetalheartrate,liquor,moulding,cervicaldilationb,descentofhead,contraction,doseofoxytocinadministered,urineprotein,urineacetone,urinevolume,effecement,staffname} = req.body;
      validateinputfaulsyvalue({selectdate,temperature,pulse,bloodpressuresystolic,bloodpressurediastolic,respiratoryrate,foetalheartrate,liquor,moulding,cervicaldilationb,descentofhead,contraction,doseofoxytocinadministered,urineprotein,urineacetone,urinevolume,effecement,staffname});
       //frequency must inlcude
       //route must contain allowed options
      
      const patientrecord:any =  await readonepatient({_id:id},{},'','');    
      //console.log(admissionrecord);   
      if(!patientrecord){
           throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);
  
       }
    const queryresult=await createpathograph({patient:patientrecord._id,selectdate,temperature,pulse,bloodpressuresystolic,bloodpressurediastolic,respiratoryrate,foetalheartrate,liquor,moulding,cervicaldilationb,descentofhead,contraction,doseofoxytocinadministered,urineprotein,urineacetone,urinevolume,effecement,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}


//insulin

export async function updatepathographs(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var { selectdate,temperature,pulse,bloodpressuresystolic,bloodpressurediastolic,respiratoryrate,foetalheartrate,liquor,moulding,cervicaldilationb,descentofhead,contraction,doseofoxytocinadministered,urineprotein,urineacetone,urinevolume,effecement,staffname} = req.body;
    validateinputfaulsyvalue({selectdate,temperature,pulse,bloodpressuresystolic,bloodpressurediastolic,respiratoryrate,foetalheartrate,liquor,moulding,cervicaldilationb,descentofhead,contraction,doseofoxytocinadministered,urineprotein,urineacetone,urinevolume,effecement,staffname});
    
    var queryresult = await updatepathograph(id, {selectdate,temperature,pulse,bloodpressuresystolic,bloodpressurediastolic,respiratoryrate,foetalheartrate,liquor,moulding,cervicaldilationb,descentofhead,contraction,doseofoxytocinadministered,urineprotein,urineacetone,urinevolume,effecement,staffname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }


  //deactivate a user
export async function markascomplete(req:any, res:any){
    const {id} = req.params;
    try{
        
        const queryresult:any =await updatepathograph(id,{status:configuration.status[6]});
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


  
      
  