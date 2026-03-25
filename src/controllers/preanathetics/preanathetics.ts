import configuration from '../../config';
import {uploadbase64image,validateinputfaulsyvalue} from "../../utils/otherservices";
import {updatethearteadmission,readonethearteadmission} from  "../../dao/theatreadmission";
import {createpreanathetics, readonepreanathetics, updatepreanathetics} from "../../dao/preanathetics";

export const fillpreanatheticsform = async (req:any, res:any) => {
try{
const { 
    pastmedicalhistory,
    presentmedicalhistory,
    anaestheticmedicalhistory,
    drugshistory,
    dentalhistory,
    familyhistory,
    physicalexamination,
    airwayassessment,
    mouth,
    neck,
    throidmentaldish,
    malamphaticscore,
    plan,
} = req.body;
const {theatreadmission} = req.params;
validateinputfaulsyvalue({
    theatreadmission,
    pastmedicalhistory,
    presentmedicalhistory,
    anaestheticmedicalhistory,
    drugshistory,
    dentalhistory,
    familyhistory,
    physicalexamination,
    airwayassessment,
    mouth,
    neck,
    throidmentaldish,
    malamphaticscore,
    plan
});
      

//validate theatre admission
  var  findAdmission = await readonethearteadmission({_id:theatreadmission},{},'');

  if(!findAdmission){
    throw new Error(`Theatre Admission already exists`);

}
//const queryresult:any =await updatethearteadmission(id,{status});
//create conscent
const preanathetics = await createpreanathetics({theatreadmission,
    pastmedicalhistory,
    presentmedicalhistory,
    anaestheticmedicalhistory,
    drugshistory,
    dentalhistory,
    familyhistory,
    physicalexamination,
    airwayassessment,    mouth,
    neck,
    throidmentaldish,
    malamphaticscore,
    plan
})
//update theatre admission
const queryresult:any =await updatethearteadmission(theatreadmission,{preanathetics:preanathetics._id});
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
  export const readpreanatheticsformbytheatreadmission = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {theatreadmission} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readonepreanathetics({theatreadmission},{},'');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };


  export const updatepreanatheticsconscentform = async (req:any, res:any) => {
    try{
        const { 
            pastmedicalhistory,
            presentmedicalhistory,
            anaestheticmedicalhistory,
            drugshistory,
            dentalhistory,
            familyhistory,
            physicalexamination,
            airwayassessment,
            mouth,
            neck,
            throidmentaldish,
            malamphaticscore,
            plan,
        } = req.body;
    const {id} = req.params;
    validateinputfaulsyvalue({id,pastmedicalhistory,
        presentmedicalhistory,
        anaestheticmedicalhistory,
        drugshistory,
        dentalhistory,
        familyhistory,
        physicalexamination,
        airwayassessment,
        mouth,
        neck,
        throidmentaldish,
        malamphaticscore,
        plan});
          
    //theatre
    //const filename = await uploadbase64image(imageBase64);
    //validate theatre admission
      var  findAdmission = await readonepreanathetics({_id:id},{},'');
      if(!findAdmission){
        throw new Error(`Preanathetics Form does not  already exists`);
    
    }
    //const queryresult:any =await updatethearteadmission(id,{status});
    //create conscent
    const queryresult = await updatepreanathetics(id,{
            pastmedicalhistory,
            presentmedicalhistory,
            anaestheticmedicalhistory,
            drugshistory,
            dentalhistory,
            familyhistory,
            physicalexamination,
            airwayassessment,
            mouth,
            neck,
            throidmentaldish,
            malamphaticscore,
            plan
    })
   
    res.status(200).json({
        queryresult,
        status:true
      }); 
   
    }
    catch(e:any){
        res.status(403).json({ status: false, msg: e.message });
    
    }
    
    
    }