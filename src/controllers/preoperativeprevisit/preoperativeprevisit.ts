import configuration from '../../config';
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import {updatethearteadmission,readonethearteadmission} from  "../../dao/theatreadmission";
import {createpreoperativeprevisit, readonepreoperativeprevisit, updatepreoperativeprevisit} from "../../dao/preoperativeprevisit";

export const fillpreoperativeprevisitform = async (req:any, res:any) => {
try{
const {theatreadmission} = req.params;
validateinputfaulsyvalue({theatreadmission});      
//theatre

//validate theatre admission
  var  findAdmission = await readonethearteadmission({_id:theatreadmission},{},'');
  if(!findAdmission){
    throw new Error(`Theatre Admission ${configuration.error.erroralreadyexit}`);

}
req.body.theatreadmission=theatreadmission;
//const queryresult:any =await updatethearteadmission(id,{status});
//create conscent
const preoperativeprevisit = await createpreoperativeprevisit(req.body);
//update theatre admission
const queryresult:any =await updatethearteadmission(theatreadmission,{preoperativeprevisit:preoperativeprevisit._id});
res.status(200).json({
    queryresult,
    status:true
  }); 

}
catch(e:any){
    res.status(403).json({ status: false, msg: e.message });

}


}

//get lab order by patient
  export const readpreoperativeprevisitformbytheatreadmission = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {theatreadmission} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readonepreoperativeprevisit({theatreadmission},{},'');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };


  export const updatefillpreoperativeprevisitform = async (req:any, res:any) => {
    try{
    //const { nameofexplainer,nameofrepresentive,conscentdate} = req.body;
    const {id} = req.params;
    //validateinputfaulsyvalue({id,nameofexplainer,nameofrepresentive,conscentdate});
          
    //theatre
    //const filename = await uploadbase64image(imageBase64);
    //validate theatre admission
      var  findAdmission = await readonepreoperativeprevisit({_id:id},{},'');
      if(!findAdmission){
        throw new Error(`Preoperative previsit Form ${configuration.error.erroralreadyexit}`);
    
    }
    //const queryresult:any =await updatethearteadmission(id,{status});
    //create conscent
    const queryresult = await updatepreoperativeprevisit(id,req.body)
   
    res.status(200).json({
        queryresult,
        status:true
      }); 
   
    }
    catch(e:any){
        res.status(403).json({ status: false, msg: e.message });
    
    }
    
    
    }