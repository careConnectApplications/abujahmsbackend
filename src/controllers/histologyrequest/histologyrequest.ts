import configuration from '../../config';
import {uploadbase64image,validateinputfaulsyvalue} from "../../utils/otherservices";
import {updatethearteadmission,readonethearteadmission} from  "../../dao/theatreadmission";
import {createhistologyrequest,readonehistology,updatehistology} from "../../dao/histology";

export const fillhistologyrequestform = async (req:any, res:any) => {
try{
const {theatreadmission} = req.params;

const { africannonafrican,historyofpresentillness,presentingcomplaint,findingonphysicalexamination,otherfindings,anatomicalsiteofbiopsy,grossappearanceoflesion,previousreportwithnumberanddate,nameofconsultant} = req.body; 
const { firstName, lastName } = (req.user).user;
var filledby=`${firstName} ${lastName}`;

validateinputfaulsyvalue({theatreadmission, africannonafrican,historyofpresentillness,presentingcomplaint,findingonphysicalexamination,otherfindings,anatomicalsiteofbiopsy,grossappearanceoflesion,previousreportwithnumberanddate,nameofconsultant});
     
//theatre

//validate theatre admission
  var  findAdmission = await readonethearteadmission({_id:theatreadmission},{},'');
  if(!findAdmission){
    throw new Error(`Theatre Admission does not exist`);

}

const queryresult = await createhistologyrequest({theatreadmission,africannonafrican,historyofpresentillness,presentingcomplaint,findingonphysicalexamination,otherfindings,anatomicalsiteofbiopsy,grossappearanceoflesion,previousreportwithnumberanddate,nameofconsultant ,filledby});

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
  export const readhistologyrequestformytheatreadmission = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {theatreadmission} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readonehistology({theatreadmission},{},'');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };


  export const updatehistologyrequestform = async (req:any, res:any) => {
    try{
   
    const {id} = req.params;
    const { africannonafrican,historyofpresentillness,presentingcomplaint,findingonphysicalexamination,otherfindings,anatomicalsiteofbiopsy,grossappearanceoflesion,previousreportwithnumberanddate,nameofconsultant} = req.body; 
    validateinputfaulsyvalue({id, africannonafrican,historyofpresentillness,presentingcomplaint,findingonphysicalexamination,otherfindings,anatomicalsiteofbiopsy,grossappearanceoflesion,previousreportwithnumberanddate,nameofconsultant});

  
          
    //theatre
    //const filename = await uploadbase64image(imageBase64);
    //validate theatre admission
      var  findhistologyrequestform = await readonehistology({_id:id},{},'');
      if(!findhistologyrequestform){
        throw new Error(`Histology Request Form already exists`);
    
    }
    //const queryresult:any =await updatethearteadmission(id,{status});
    //create conscent
    const queryresult = await updatehistology(id,{africannonafrican,historyofpresentillness,presentingcomplaint,findingonphysicalexamination,otherfindings,anatomicalsiteofbiopsy,grossappearanceoflesion,previousreportwithnumberanddate,nameofconsultant})
   
    res.status(200).json({
        queryresult,
        status:true
      }); 
   
    }
    catch(e:any){
        res.status(403).json({ status: false, msg: e.message });
    
    }
    
    
    }