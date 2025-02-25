import path from "path";
import configuration from "../../config";
import  {readone}  from "../../dao/users";
import {readallappointmentfirstfive,modifiedreadallappointment} from "../../dao/appointment";



//get all users
export async function dashboard(req:any, res:any){
    try{
      const { _id } = (req.user).user;
        const user = await readone({_id});
        const appointment = await readallappointmentfirstfive({status:configuration.status[9],doctor:_id},{},'patient','doctor','payment');
   
    let aggregatequery = 
    [ {
      $lookup: {
        from: 'labs',       
        localField: 'lab',    
        foreignField: '_id',     
        as: 'lab'     
      }
    },
    
    {
      $match: { doctor:_id }  // Filter payment
    }
    
  ]; 
    const lab = await modifiedreadallappointment({},aggregatequery);
        res.status(200).json({
            queryresult:{user,appointment,lab},
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}
