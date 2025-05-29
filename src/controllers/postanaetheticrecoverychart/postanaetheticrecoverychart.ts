//postanaetheticrecoverychart

import configuration from '../../config';
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import {readonethearteadmission} from  "../../dao/theatreadmission";
import {createpostanaetheticrecoverychart,readonepostanaetheticrecoverychart,updatepostanaetheticrecoverychart} from "../../dao/postanaetheticrecoverychart";
import {readallvitalsignscores,createvitalsignscore,updatevitalsignscore} from "../../dao/vitalsignscore";




export const fillpostanaetheticrecoverychartform = async (req:any, res:any) => {
try{
    
const { score,timeofdischarge,treatmentgiveninrecoveryroom,commentsbyrecoverynurseorwardnurse,commentsbyanaesthetist} = req.body; 
const {theatreadmission} = req.params;
const { firstName, lastName } = (req.user).user;
var filledby=`${firstName} ${lastName}`;

validateinputfaulsyvalue({theatreadmission,score,timeofdischarge,treatmentgiveninrecoveryroom,commentsbyrecoverynurseorwardnurse,commentsbyanaesthetist});
//validate theatre admission
  var  findAdmission = await readonethearteadmission({_id:theatreadmission},{},'');
  if(!findAdmission){
    throw new Error(`Theatre Admission ${configuration.error.erroralreadyexit}`);

}
//const queryresult:any =await updatethearteadmission(id,{status});
//create conscent
const queryresult = await createpostanaetheticrecoverychart({theatreadmission,score,timeofdischarge,treatmentgiveninrecoveryroom,commentsbyrecoverynurseorwardnurse,commentsbyanaesthetist,filledby})
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
  export const readonepostanaetheticrecoverychartformbytheatreadmission = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {theatreadmission} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readonepostanaetheticrecoverychart({theatreadmission},{},'','');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };


  export const updatepostanaetheticrecoverychartform = async (req:any, res:any) => {
    try{
    const { score,timeofdischarge,treatmentgiveninrecoveryroom,commentsbyrecoverynurseorwardnurse,commentsbyanaesthetist} = req.body;
    const {id} = req.params;
    validateinputfaulsyvalue({id,score,timeofdischarge,treatmentgiveninrecoveryroom,commentsbyrecoverynurseorwardnurse,commentsbyanaesthetist});
          
    //theatre
    //const filename = await uploadbase64image(imageBase64);
    //validate theatre admission
      var  findAdmission = await readonepostanaetheticrecoverychart({_id:id},{},'','');
      if(!findAdmission){
        throw new Error(`Postanaetheticrecoverychart Form ${configuration.error.erroralreadyexit}`);
    
    }
    //const queryresult:any =await updatethearteaadmission(id,{status});
    //create conscent
    const queryresult = await updatepostanaetheticrecoverychart(id,{score,timeofdischarge,treatmentgiveninrecoveryroom,commentsbyrecoverynurseorwardnurse,commentsbyanaesthetist})
   
    res.status(200).json({
        queryresult,
        status:true
      }); 
   
    }
    catch(e:any){
        res.status(403).json({ status: false, msg: e.message });
    
    }
    
    
    }

    


    ///////////////////////////////vital signs score //////////////////////////////////////////
    

    export const readallvitalsignscoreByTheatreAdmission = async (req:any, res:any) => {
        try {
         const {postanaetheticrecoverychart} = req.params;
          const queryresult = await readallvitalsignscores({postanaetheticrecoverychart},{});
          res.status(200).json({
            queryresult,
            status:true
          }); 
        } catch (error:any) {
          res.status(403).json({ status: false, msg: error.message });
        }
      };
     
      // Create a drug given
    export const createvitalsignscores = async (req:any, res:any) => {
        try {
          const {postanaetheticrecoverychart} = req.params;
          const { firstName,lastName} = (req.user).user;
          req.body.staffname = `${firstName} ${lastName}`;

          
          //blood sugar monitoring chart (contents: Date, Time, Test Type (drop down, RBS FBS), Value (mmol/l) , done by user acct.
          var {staffname,consciousness,ventilation,movement,total,bp,pulserate,respiration,color,temperature,time} = req.body;
          validateinputfaulsyvalue({consciousness,ventilation,movement,total,bp,pulserate,respiration,color,temperature,time});
           //frequency must inlcude
           //route must contain allowed options
          
          var  findpostanaetheticrecoverychart = await readonepostanaetheticrecoverychart({_id:postanaetheticrecoverychart},{},'','');
          if(!findpostanaetheticrecoverychart){
            throw new Error(`Postanaetheticrecoverychart form ${configuration.error.erroralreadyexit}`);

        }
        const queryresult=await createvitalsignscore({ staffname,postanatheticrecoverychart:findpostanaetheticrecoverychart._id,consciousness,ventilation,movement,total,bp,pulserate,respiration,color,temperature,time,});
        res.status(200).json({queryresult, status: true});
        }
        catch(e:any){
            res.status(403).json({status: false, msg:e.message});
    
        }
    }
    
    
    
    export async function updatevitalsignscores(req:any, res:any){
        try{
        //get id
        const {id} = req.params;
        const { firstName,lastName} = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
       var {staffname,consciousness,ventilation,movement,total,bp,pulserate,respiration,color,temperature,time} = req.body;
        validateinputfaulsyvalue({consciousness,ventilation,movement,total,bp,pulserate,respiration,color,temperature,time});

        var queryresult = await updatevitalsignscore(id, { staffname,consciousness,ventilation,movement,total,bp,pulserate,respiration,color,temperature,time});
        res.status(200).json({
            queryresult,
            status:true
          }); 
        }catch(e:any){
          console.log(e);
          res.status(403).json({status: false, msg:e.message});
    
        }
    
      }
    
    