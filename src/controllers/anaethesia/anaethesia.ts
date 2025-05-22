import configuration from '../../config';
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import {readonethearteadmission} from  "../../dao/theatreadmission";
import {createanaethesia,readoneanaethesia,updateanaethesia} from "../../dao/anaethesia";

export const fillanaethesiaform = async (req:any, res:any) => {
try{
const { preopeassessment,allergies,weight,asa,temp,premedication,timegivenpremedication,timeoflastfood,vlinesite,cannulasize,technique,bloodloss,totalinput,postofinstruction} = req.body; 
const {theatreadmission} = req.params;
const { firstName, lastName } = (req.user).user;
var filledby=`${firstName} ${lastName}`;

validateinputfaulsyvalue({theatreadmission,preopeassessment,allergies,weight,asa,temp,premedication,timegivenpremedication,timeoflastfood,vlinesite,cannulasize,technique,bloodloss,totalinput,postofinstruction});
//validate theatre admission
  var  findAdmission = await readonethearteadmission({_id:theatreadmission},{},'');
  if(!findAdmission){
    throw new Error(`Theatre Admission ${configuration.error.erroralreadyexit}`);

}
//const queryresult:any =await updatethearteadmission(id,{status});
//create conscent
const queryresult = await createanaethesia({theatreadmission,preopeassessment,allergies,weight,asa,temp,premedication,timegivenpremedication,timeoflastfood,vlinesite,cannulasize,technique,bloodloss,totalinput,postofinstruction,filledby})
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
  export const readreadoneanaethesiaformbytheatreadmission = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {theatreadmission} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readoneanaethesia({theatreadmission},{},'','');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };


  export const updateanaethesiaform = async (req:any, res:any) => {
    try{
    const { preopeassessment,allergies,weight,asa,temp,premedication,timegivenpremedication,timeoflastfood,vlinesite,cannulasize,technique,bloodloss,totalinput,postofinstruction} = req.body;
    const {id} = req.params;
    validateinputfaulsyvalue({id,preopeassessment,allergies,weight,asa,temp,premedication,timegivenpremedication,timeoflastfood,vlinesite,cannulasize,technique,bloodloss,totalinput,postofinstruction});
          
    //theatre
    //const filename = await uploadbase64image(imageBase64);
    //validate theatre admission
      var  findAdmission = await readoneanaethesia({_id:id},{},'','');
      if(!findAdmission){
        throw new Error(`Anaethesia Form ${configuration.error.erroralreadyexit}`);
    
    }
    //const queryresult:any =await updatethearteaadmission(id,{status});
    //create conscent
    const queryresult = await updateanaethesia(id,{preopeassessment,allergies,weight,asa,temp,premedication,timegivenpremedication,timeoflastfood,vlinesite,cannulasize,technique,bloodloss,totalinput,postofinstruction})
   
    res.status(200).json({
        queryresult,
        status:true
      }); 
   
    }
    catch(e:any){
        res.status(403).json({ status: false, msg: e.message });
    
    }
    
    
    }

    //////////////////////////drugs given //////////////////////////////////////////////


    ///////////////////////////////food given //////////////////////////////////////////