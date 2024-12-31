import {readalllab,updatelab,readonelab} from "../../dao/lab";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import  {readone}  from "../../dao/users";
import configuration from "../../config";
// Get all lab records
export const readalllabb = async (req:any, res:any) => {
    try {
        //const {clinic} = (req.user).user;
      //const queryresult = await readalllab({department:clinic},{},'patient','appointment','payment');
      const queryresult = await readalllab({},{},'patient','appointment','payment');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
  //get lab order by patient
  export const readAllLabByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {id} = req.params;
      //const queryresult = await readalllab({patient:id,department:clinic},{},'patient','appointment','payment');
      const queryresult = await readalllab({patient:id},{},'patient','appointment','payment');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
  //lab processing
 export async function labresultprocessing(req:any, res:any){
  try{
  //get id
  const {id} = req.params;
  const {subcomponents} = req.body;
  const {email, staffId} = (req.user).user;
  //find id and validate
  var lab =await readonelab({_id:id},{},'');
  validateinputfaulsyvalue({lab,subcomponents});
  const user = await readone({email, staffId});

  //loop through array of subcomponent 
  for(var i=0; i < subcomponents.length; i++){
    //throw error if no subcomponent
    const {subcomponent,result,nranges,unit} =subcomponents[i];
    validateinputfaulsyvalue({subcomponent,result,nranges,unit})
  }
  //update test, lab technical name and test status
  var queryresult=await updatelab({_id:id},{$push: {testresult:subcomponents},status:configuration.status[7],staffname:user?._id});
  //update status of appointment
 
  res.status(200).json({
      queryresult,
      status:true
    });
    
  }catch(e:any){
    console.log(e);
    res.status(403).json({status: false, msg:e.message});

  }

}

//view all schedule lab
// Get all lab records
export const readallscheduledlab = async (req:any, res:any) => {
  try {
      //const {clinic} = (req.user).user;
    //const queryresult = await readalllab({department:clinic},{},'patient','appointment','payment');
    const queryresult = await readalllab({status:configuration.status[5]},{},'patient','appointment','payment');
    res.status(200).json({
      queryresult,
      status:true
    }); 
  } catch (error:any) {
    res.status(403).json({ status: false, msg: error.message });
  }
};
//5
//lab reports
