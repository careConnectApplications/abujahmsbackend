import {readalldailywardreport,createdailywardreports,updatedailywardreports} from "../../dao/dailywardreport";
import {readonewardmanagement} from "../../dao/wardmanagement";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
import  mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import  {readone}  from "../../dao/users";
import configuration from "../../config";

// Get all lab records
export const readalldailywardreports = async (req:any, res:any) => {
    try {
   
      const queryresult = await readalldailywardreport({},{},'ward');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
  //
  export const readalldailywardreportsByward = async (req:any, res:any) => {
    try {
     const {ward} = req.params;
      const queryresult = await readalldailywardreport({ward},{},'ward');
      res.status(200).json({
        queryresult,
        status:true
      }); 
    } catch (error:any) {
      res.status(403).json({ status: false, msg: error.message });
    }
  };
 

export const createdailywardreport = async (req:any, res:any) => {
    try {
      
      const { firstName,lastName} = (req.user).user;
      req.body.staffname = `${firstName} ${lastName}`;
      var { wardreport,staffname,wardname} = req.body;
      validateinputfaulsyvalue({wardreport,staffname,wardname}); 
    //validate ward
     const foundWard:any =  await readonewardmanagement({wardname},'');
            if(!foundWard){
                throw new Error(`Ward ${configuration.error.errornotfound}`);
    
            }

    const queryresult=await createdailywardreports({ward:foundWard._id,wardreport,staffname});
    res.status(200).json({queryresult, status: true});
    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }
}
//update vitalcharts
export async function updatedailywardreport(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const { firstName,lastName} = (req.user).user;
    req.body.staffname = `${firstName} ${lastName}`;
    var { wardreport,staffname,wardname} = req.body;
    validateinputfaulsyvalue({wardreport,staffname,wardname}); 
    const foundWard:any =  await readonewardmanagement({wardname},'');
    if(!foundWard){
        throw new Error(`Ward ${configuration.error.errornotfound}`);

    }
 
    var queryresult = await updatedailywardreports(id, {wardreport,staffname,ward:foundWard._id});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }

  
      
  