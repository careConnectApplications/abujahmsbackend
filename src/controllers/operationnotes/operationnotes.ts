import configuration from '../../config';
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import {updatethearteadmission,readonethearteadmission} from  "../../dao/theatreadmission";
import {createoperationnote, readoneoperationnote, updateoperationnote} from "../../dao/operationnotes";

export const filloperationnote = async (req:any, res:any) => {
try{

    
const {theatreadmission} = req.params;
const {  diagnosispreop,diagnosisoperative,operative,surgeon,assistants,preoperativenurse,anestheticnurse,typeofanesthetic,findings} = req.body; 
const { firstName, lastName } = (req.user).user;
var filledby=`${firstName} ${lastName}`;

validateinputfaulsyvalue({theatreadmission, diagnosispreop,diagnosisoperative,operative,surgeon,assistants,preoperativenurse,anestheticnurse,typeofanesthetic,findings});
     
//theatre

//validate theatre admission
  var  findAdmission = await readonethearteadmission({_id:theatreadmission},{},'');
  if(!findAdmission){
    throw new Error(`Theatre Admission does not exist`);

}

const queryresult = await createoperationnote({theatreadmission, diagnosispreop,diagnosisoperative,operative,surgeon,assistants,preoperativenurse,anestheticnurse,typeofanesthetic,findings,filledby});

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
  export const readoperationnotebytheatreadmission = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {theatreadmission} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readoneoperationnote({theatreadmission},{},'');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };


  export const updatefilloperationnote = async (req:any, res:any) => {
    try{

const {id} = req.params; 
const {  diagnosispreop,diagnosisoperative,operative,surgeon,assistants,preoperativenurse,anestheticnurse,typeofanesthetic,findings} = req.body; 
const { firstName, lastName } = (req.user).user;
var filledby=`${firstName} ${lastName}`;

validateinputfaulsyvalue({diagnosispreop,diagnosisoperative,operative,surgeon,assistants,preoperativenurse,anestheticnurse,typeofanesthetic,findings});

 
      var  findoperationnote = await readoneoperationnote({_id:id},{},'');
      if(!findoperationnote){
        throw new Error(`Operation Note already exists`);
    
    }
  
    const queryresult = await updateoperationnote(id,{diagnosispreop,diagnosisoperative,operative,surgeon,assistants,preoperativenurse,anestheticnurse,typeofanesthetic,findings,filledby})
   
    res.status(200).json({
        queryresult,
        status:true
      }); 
   
    }
    catch(e:any){
        res.status(403).json({ status: false, msg: e.message });
    
    }
    
    
    }