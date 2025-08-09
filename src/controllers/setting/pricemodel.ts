import { types } from "util";
import configuration from "../../config";
import  {createpricemodel, readonepricemodel, updatepricemodel}  from "../../dao/pricingmodel";
import { validateinputfaulsyvalue,generateRandomNumber} from "../../utils/otherservices";
import {createaudit} from "../../dao/audit";
import clinic from "../../models/clinics";
//add patiient
export var createpricingmodel = async (req:any,res:any) =>{
   
    try{
     console.log(req.body);
       const {pricingtype,exactnameofancclinic,exactnameofservicetypeforadult,exactnameofservicetypeforchild} = req.body;
       const { firstName, lastName } = (req.user).user;
       var actor = `${firstName} ${lastName}`;
       validateinputfaulsyvalue({pricingtype,exactnameofancclinic,exactnameofservicetypeforadult,exactnameofservicetypeforchild});   
        const foundPricingmodel =  await readonepricemodel({});
        if(foundPricingmodel){
            throw new Error(`Pricing Model ${configuration.error.erroralreadyexit}`);

        }
         const queryresult=await createpricemodel({pricingtype,exactnameofancclinic,exactnameofservicetypeforadult,exactnameofservicetypeforchild});
         //create audit log
       
         await createaudit({action:"Created Pricing Model",actor,affectedentity:pricingtype});
        res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}

//read all patients
export async function getpricingmodel(req:Request, res:any){
    try{
       
        const queryresult = await readonepricemodel({});
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}


//update a price
export async function updatepricingmodel(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
   const {pricingtype,exactnameofancclinic,exactnameofservicetypeforadult,exactnameofservicetypeforchild} = req.body;
    const { firstName, lastName } = (req.user).user;
    var actor = `${firstName} ${lastName}`;
    validateinputfaulsyvalue({pricingtype,exactnameofancclinic,exactnameofservicetypeforadult,exactnameofservicetypeforchild});
    var queryresult = await updatepricemodel(id, {pricingtype,exactnameofancclinic,exactnameofservicetypeforadult,exactnameofservicetypeforchild});
    await createaudit({action:"Update Pricing Model",actor,affectedentity:pricingtype});
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
