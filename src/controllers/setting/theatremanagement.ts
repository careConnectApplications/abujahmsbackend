import configuration from "../../config";
import  {createtheatremanagement,readonetheatremanagement,readalltheatremanagement,updatetheatremanagement}  from "../../dao/theatre";
import {readoneclinic} from "../../dao/clinics";
import { validateinputfaulsyvalue,generateRandomNumber,validateinputfornumber} from "../../utils/otherservices";
//add patiient
export var createtheatre = async (req:any,res:any) =>{
   
    try{
     
       const {bedspecialization,theatrename,totalbed,occupiedbed} = req.body;
       validateinputfaulsyvalue({bedspecialization,theatrename});
       validateinputfornumber({totalbed,occupiedbed});
       //validate that totalbed is created or equal to occupiedbed
       if(occupiedbed >  totalbed){
       
        throw new Error(`Occupied bed ${configuration.error.errorgreaterthan} Total bed`);


       }
       const vacantbed = totalbed - occupiedbed;
       var theatreid = `${theatrename[0]}${generateRandomNumber(5)}${theatrename[theatrename.length -1]}`;
       //validate specialization
       const foundSpecilization =  await readoneclinic({clinic:bedspecialization},'');
       if(!foundSpecilization){
           throw new Error(`Specialization doesnt ${configuration.error.erroralreadyexit}`);

       }
       
   
      
      // validate ward
        const foundtheatre =  await readonetheatremanagement({theatrename},'');
        if(foundtheatre){
            throw new Error(`Theatre ${configuration.error.erroralreadyexit}`);

        }
         const queryresult=await createtheatremanagement({bedspecialization,vacantbed,theatrename,totalbed,occupiedbed,theatreid});
        res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}

//read all wards

export async function getalltheatre(req:Request, res:any){
    try{
       
        const queryresult = await readalltheatremanagement({},'');
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}

//update ward
export async function updatetheatre(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const {bedspecialization,totalbed,occupiedbed} = req.body;
    validateinputfaulsyvalue({bedspecialization});
    validateinputfornumber({totalbed,occupiedbed});
    //validate that totalbed is created or equal to occupiedbed
    if(occupiedbed >  totalbed){
    
     throw new Error(`Occupied bed ${configuration.error.errorgreaterthan} Total bed`);


    }
    const vacantbed = totalbed - occupiedbed;
    var queryresult = await updatetheatremanagement(id, {bedspecialization,vacantbed,totalbed,occupiedbed});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }
  
/*
  export async function updatepricestatus(req:any, res:any){
    const {id} = req.params;
    try{
        const response = await readoneprice({_id:id});
       const status= response?.status == configuration.status[0]? configuration.status[1]: configuration.status[0];
        const queryresult:any =await updateprice(id,{status});
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
*/
