import {readalldeliverynotes,createdeliverynotes,updatedeliverynotes} from "../../dao/deliverynote";
import {readonepatient} from "../../dao/patientmanagement";
import {validateinputfaulsyvalue,validateinputyesno} from "../../utils/otherservices";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";


  //get lab order by patient
  export const readAlldeliverynoteByPatient = async (req:any, res:any) => {
    try {
      //const {clinic} = (req.user).user;
      const {patient} = req.params;
      const queryresult = await readalldeliverynotes({patient},{},'patient');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };

  //create vital charts
  // Create a new schedule
export const createdeliverynote = async (req:any, res:any) => {
    try {
      const {id} = req.params;
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      //ensure the field type

      var { note,staffname} = req.body;
      validateinputfaulsyvalue({note,staffname});
    
      
      const patientrecord:any =  await readonepatient({_id:id},{},'','');    
      //console.log(admissionrecord);   
      if(!patientrecord){
           throw new Error(`Patient does not exist`);
  
       }
    const queryresult=await createdeliverynotes({patient:patientrecord._id,note,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}


//insulin

export async function updatedeliverynote(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var {note,staffname} = req.body;
    validateinputfaulsyvalue({note,staffname});
    
    var queryresult = await updatedeliverynotes(id, {note,staffname});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }

  
      
  