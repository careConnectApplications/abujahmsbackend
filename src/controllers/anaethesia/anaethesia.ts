import configuration from '../../config';
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import {readonethearteadmission} from  "../../dao/theatreadmission";
import {createanaethesia,readoneanaethesia,updateanaethesia} from "../../dao/anaethesia";
import {createdruggiven,readalldruggivens,updatedruggiven} from "../../dao/druggiven";
import {createfoodgiven, readallfoodgivens, updatefoodgiven} from "../../dao/foodgiven"




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
    throw new Error(`Theatre Admission already exists`);

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
        throw new Error(`Anaethesia Form already exists`);
    
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
    export const readalldruggivenByTheatreAdmission = async (req:any, res:any) => {
        try {
         const {anathesia} = req.params;
          const queryresult = await readalldruggivens({anathesia},{});
          res.status(200).json({
            queryresult,
            status:true
          }); 
        } catch (error:any) {
          res.status(403).json({ status: false, msg: error.message });
        }
      };
     
      // Create a drug given
    export const createdruggivens = async (req:any, res:any) => {
        try {
          const {anathesia} = req.params;
          const { firstName,lastName} = (req.user).user;
          req.body.staffname = `${firstName} ${lastName}`;
          
          //blood sugar monitoring chart (contents: Date, Time, Test Type (drop down, RBS FBS), Value (mmol/l) , done by user acct.
          var {staffname,druggiven,timegiven,bp,pulse,temp} = req.body;
          validateinputfaulsyvalue({druggiven,timegiven,bp,pulse,temp});
           //frequency must inlcude
           //route must contain allowed options
          
  var  findanathesia = await readoneanaethesia({_id:anathesia},{},'','');
  if(!findanathesia){
    throw new Error(`Anathesia record already exists`);

}
        const queryresult=await createdruggiven({druggiven,timegiven,bp,pulse,temp,staffname,anathesia:findanathesia._id});
        res.status(200).json({queryresult, status: true});
        }
        catch(e:any){
            res.status(403).json({status: false, msg:e.message});
    
        }
    }
    
    

    
    export async function updatedruggivens(req:any, res:any){
        try{
        //get id
        const {id} = req.params;
        const { firstName,lastName} = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
       var {staffname,druggiven,timegiven,bp,pulse,temp} = req.body;
        validateinputfaulsyvalue({druggiven,timegiven,bp,pulse,temp});

        var queryresult = await updatedruggiven(id, {druggiven,timegiven,bp,pulse,temp,staffname});
        res.status(200).json({
            queryresult,
            status:true
          }); 
        }catch(e:any){
          console.log(e);
          res.status(403).json({status: false, msg:e.message});
    
        }
    
      }
    
      
    


    ///////////////////////////////food given //////////////////////////////////////////

    export const readallfoodgivenByTheatreAdmission = async (req:any, res:any) => {
        try {
         const {anathesia} = req.params;
          const queryresult = await readallfoodgivens({anathesia},{});
          res.status(200).json({
            queryresult,
            status:true
          }); 
        } catch (error:any) {
          res.status(403).json({ status: false, msg: error.message });
        }
      };
     
      // Create a drug given
    export const createfoodgivens = async (req:any, res:any) => {
        try {
          const {anathesia} = req.params;
          const { firstName,lastName} = (req.user).user;
          req.body.staffname = `${firstName} ${lastName}`;
          
          //blood sugar monitoring chart (contents: Date, Time, Test Type (drop down, RBS FBS), Value (mmol/l) , done by user acct.
          var {staffname,foodgiven,timegiven,bp,pulse,temp} = req.body;
          validateinputfaulsyvalue({foodgiven,timegiven,bp,pulse,temp});
           //frequency must inlcude
           //route must contain allowed options
          
          var  findanathesia = await readoneanaethesia({_id:anathesia},{},'','');
          if(!findanathesia){
            throw new Error(`Anathesia record already exists`);

        }
        const queryresult=await createfoodgiven({ foodgiven,timegiven,bp,pulse,temp,staffname,anathesia:findanathesia._id});
        res.status(200).json({queryresult, status: true});
        }
        catch(e:any){
            res.status(403).json({status: false, msg:e.message});
    
        }
    }
    
    
    
    export async function updatefoodgivens(req:any, res:any){
        try{
        //get id
        const {id} = req.params;
        const { firstName,lastName} = (req.user).user;
        req.body.staffname = `${firstName} ${lastName}`;
       var {staffname, foodgiven,timegiven,bp,pulse,temp} = req.body;
        validateinputfaulsyvalue({foodgiven,timegiven,bp,pulse,temp});

        var queryresult = await updatefoodgiven(id, { foodgiven,timegiven,bp,pulse,temp,staffname});
        res.status(200).json({
            queryresult,
            status:true
          }); 
        }catch(e:any){
          console.log(e);
          res.status(403).json({status: false, msg:e.message});
    
        }
    
      }
    
    