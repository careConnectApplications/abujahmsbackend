import path from "path";
import configuration from "../../config";
import  {readone}  from "../../dao/users";
import {readallappointmentfirstfive,countappointment} from "../../dao/appointment";
import {readalllablimitfive} from "../../dao/lab";




//get all users
export async function dashboard(req:any, res:any){
    try{
      const { _id } = (req.user).user;
        const user = await readone({_id});
        const firstfiveinprocressappointment = await readallappointmentfirstfive({status:configuration.status[9],doctor:_id},{},'patient','doctor','payment');
        const firstfivescheduledlab =  await readalllablimitfive({status:configuration.status[5]},{},'patient','appointment','payment');
        //attended appoitment
        const totalattendedappointment = await countappointment({$or:[{status:configuration.status[9]},{status:configuration.status[6]}]});
        //uplcomming appointment
        const totalschedulesappointment = await countappointment({status:configuration.status[5]});
        res.status(200).json({
            queryresult:{user,firstfiveinprocressappointment,firstfivescheduledlab,totalattendedappointment,totalschedulesappointment},
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}
