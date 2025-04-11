import { types } from "util";
import configuration from "../../config";
import  {readallhmomanagement,createhmomanagement,readonehmomanagement,updatehmomanagement}  from "../../dao/hmomanagement";
import { validateinputfaulsyvalue,generateRandomNumber} from "../../utils/otherservices";
import {createaudit} from "../../dao/audit";
//add patiient
export var createhmo = async (req:any,res:any) =>{
   
    try{
     console.log(req.body);
       const {hmoname} = req.body;
       const { firstName, lastName } = (req.user).user;
      var actor = `${firstName} ${lastName}`;
       validateinputfaulsyvalue({hmoname});
       var id = `${hmoname[0]}${generateRandomNumber(5)}${hmoname[hmoname.length -1]}`;  
        const foundHmo =  await readonehmomanagement({hmoname},'');
        //update servicetype for New Patient Registration
        if(foundHmo){
            throw new Error(`HMO ${configuration.error.erroralreadyexit}`);

        }
         const queryresult=await createhmomanagement({hmoname,id});
        await createaudit({action:"Create HMO",actor,affectedentity:hmoname});
         res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}

//read all patients
export async function getallhmo(req:Request, res:any){
    try{
       
        const queryresult = await readallhmomanagement({},'');
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
export async function updatehmo(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const {hmoname} = req.body;
    const { firstName, lastName } = (req.user).user;
    var actor = `${firstName} ${lastName}`;
    validateinputfaulsyvalue({hmoname,id});
    await createaudit({action:"Update HMO",actor,affectedentity:hmoname});
    var queryresult = await updatehmomanagement(id, {hmoname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }
  
