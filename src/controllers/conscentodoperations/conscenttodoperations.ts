import configuration from '../../config';
import {uploadbase64image,validateinputfaulsyvalue} from "../../utils/otherservices";
import {updatethearteadmission,readonethearteadmission} from  "../../dao/theatreadmission";
import {createconscentooperation,readoneconscentooperation,updateconscentooperation} from "../../dao/conscenttooperation";

export const fillconscentform = async (req:any, res:any) => {
try{
const { imageBase64,nameofexplainer,nameofrepresentive,conscentdate} = req.body;
const {theatreadmission} = req.params;
validateinputfaulsyvalue({theatreadmission,imageBase64,nameofexplainer,nameofrepresentive,conscentdate});
      
//theatre
const filename = await uploadbase64image(imageBase64);
//validate theatre admission
  var  findAdmission = await readonethearteadmission({_id:theatreadmission},{},'');

  if(!findAdmission){
    throw new Error(`Theatre Admission ${configuration.error.erroralreadyexit}`);

}
//const queryresult:any =await updatethearteadmission(id,{status});
//create conscent
const conscentresult = await createconscentooperation({theatreadmission,nameofexplainer,nameofrepresentive,conscentdate,filename})
//update theatre admission
const queryresult:any =await updatethearteadmission(theatreadmission,{conscent:conscentresult});
res.status(200).json({
    queryresult,
    status:true
  }); 

console.log(filename);
res.status(200).json({ message: 'Image saved successfully'});
}
catch(e:any){
    res.status(403).json({ status: false, msg: e.message });

}


}


//get lab order by patient
  export const readconscentformbytheatreadmission = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {theatreadmission} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readoneconscentooperation({theatreadmission},{},'');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };


  export const updatefillconscentform = async (req:any, res:any) => {
    try{
    const { nameofexplainer,nameofrepresentive,conscentdate} = req.body;
    const {id} = req.params;
    validateinputfaulsyvalue({id,nameofexplainer,nameofrepresentive,conscentdate});
          
    //theatre
    //const filename = await uploadbase64image(imageBase64);
    //validate theatre admission
      var  findAdmission = await readoneconscentooperation({_id:id},{},'');
      if(!findAdmission){
        throw new Error(`Conscent Form ${configuration.error.erroralreadyexit}`);
    
    }
    //const queryresult:any =await updatethearteadmission(id,{status});
    //create conscent
    const queryresult = await updateconscentooperation(id,{nameofexplainer,nameofrepresentive,conscentdate})
   
    res.status(200).json({
        queryresult,
        status:true
      }); 
   
    }
    catch(e:any){
        res.status(403).json({ status: false, msg: e.message });
    
    }
    
    
    }