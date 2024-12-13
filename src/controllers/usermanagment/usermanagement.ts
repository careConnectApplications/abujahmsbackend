import { AnyExpression } from "mongoose";
import configuration from "../../config";
import  {readall,updateuser,readone}  from "../../dao/users";

//get all users
export async function getallusers(req:Request, res:AnyExpression){
    try{
        const queryresult = await readall({});
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}
//deactivate a user
export async function updatestatus(req:any, res:any){
    const {id} = req.params;
    try{
        const response = await readone({_id:id});
       const status= response?.status == configuration.userstatus[0]? configuration.userstatus[1]: configuration.userstatus[0];
        const queryresult:any =await updateuser(id,{status});
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

}

//update a user
  export async function updateusers(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    var queryresult = await updateuser(id, req.body);
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }