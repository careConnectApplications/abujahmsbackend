import configuration from "../../config";
import  {createwardmanagement,readonewardmanagement,readallwardmanagement,updatewardmanagement}  from "../../dao/wardmanagement";
import {readoneclinic} from "../../dao/clinics";
import { validateinputfaulsyvalue,generateRandomNumber,validateinputfornumber} from "../../utils/otherservices";
import {createaudit} from "../../dao/audit";
import {createbed} from "../../dao/bed";
//add patiient
export var createward = async (req:any,res:any) =>{
   
    try{
       req.body.occupiedbed=0;
       const {bedspecialization,wardname,totalbed,occupiedbed} = req.body;
       validateinputfaulsyvalue({bedspecialization,wardname});
       validateinputfornumber({totalbed,occupiedbed});
       //validate that totalbed is created or equal to occupiedbed
       if(occupiedbed >  totalbed){
       
        throw new Error(`Occupied bed ${configuration.error.errorgreaterthan} Total bed`);


       }
       const vacantbed = totalbed - occupiedbed;
       var wardid = `${wardname[0]}${generateRandomNumber(5)}${wardname[wardname.length -1]}`;
       //validate specialization
       const foundSpecilization =  await readoneclinic({clinic:bedspecialization},'');
       if(!foundSpecilization){
           throw new Error(`Specialization doesnt ${configuration.error.erroralreadyexit}`);

       }
       
   
      
      // validate ward
        const foundWard =  await readonewardmanagement({wardname},'');
        if(foundWard){
            throw new Error(`Ward ${configuration.error.erroralreadyexit}`);

        }
       
         const queryresult=await createwardmanagement({bedspecialization,vacantbed,wardname,totalbed,occupiedbed,wardid});
        // Step 2: Create beds as separate documents
    const bedCreationPromises = [];
    for (let i = 1; i <= totalbed; i++) {
      bedCreationPromises.push(
        createbed({
          bednumber: `B${i.toString().padStart(3, '0')}`,  // e.g. B001
          ward: queryresult._id,
          status: 'vacant',
          assignedPatient: null,
          assignedDate: null
        })
      );
    }
    await Promise.all(bedCreationPromises);
         const { firstName, lastName } = (req.user).user;
            var actor = `${firstName} ${lastName}`;    
            await createaudit({action:"Created Ward",actor,affectedentity:wardname}); 
         res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}

//read all wards

export async function getallward(req:Request, res:any){
    try{
       
        const queryresult = await readallwardmanagement({},'');
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
export async function updateward(req:any, res:any){
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
    var queryresult:any = await updatewardmanagement(id, {bedspecialization,vacantbed,totalbed,occupiedbed});
    const { firstName, lastName } = (req.user).user;
    var actor = `${firstName} ${lastName}`;    
    await createaudit({action:"Updated Ward",actor,affectedentity:queryresult.wardname}); 
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
