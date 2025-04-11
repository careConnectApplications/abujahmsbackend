import configuration from "../../config";
import  {createservicetype, readoneservicetype, readallservicetype,updateservicetype}  from "../../dao/servicetype";
import { validateinputfaulsyvalue,generateRandomNumber} from "../../utils/otherservices";
import {createaudit} from "../../dao/audit";
//add patiient
export var createservicetypes = async (req:any,res:any) =>{
   
    try{
     
       const {servicetype,servicecategory,department} = req.body;
       //validate service category
       validateinputfaulsyvalue({servicetype,servicecategory,department});
       var id = `${servicetype[0]}${generateRandomNumber(5)}${servicetype[servicetype.length -1]}`;
        //validate that category is in the list of accepted category
        //get token from header
        /*
        var settings = await configuration.settings();
        if(req.body.servicecategory == settings.servicecategory[0]){
          req.body.servicetype=settings.servicecategory[0]
        }
          */
        
        //validation
        
        const foundservicetype =  await readoneservicetype({category:servicecategory},'');
        //update servicetype for New Patient Registration
      
        if(foundservicetype){
         
            throw new Error(`service category ${configuration.error.erroralreadyexit}`);

        
      }
    
         const queryresult=await createservicetype({type:servicetype,category:servicecategory,department, id});
  
        const { firstName, lastName } = (req.user).user;
        var actor = `${firstName} ${lastName}`;    
        await createaudit({action:"Created Service Type",actor,affectedentity:servicecategory});
            
         res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}

//read all service type
export async function getallservicetypes(req:Request, res:any){
    try{
       
        const queryresult = await readallservicetype({},'');
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
export async function updateservicetypes(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const {servicetype,department} = req.body;
    validateinputfaulsyvalue({servicetype,department});
    const foundservicetype =  await readoneservicetype({_id:id},'');
    //update servicetype for New Patient Registration
  
    if(!foundservicetype){
     
        throw new Error(`service category ${configuration.error.errornotfound}`);

    
  }
 
    for(var i =0; i < servicetype.length; i++){
      if((foundservicetype.type).includes(servicetype[i]))
      throw new Error(`${servicetype[i]} ${configuration.error.erroralreadyexit}`);

  }
  var queryresult:any=await updateservicetype({_id:id},{$push: {type:{$each: servicetype}},department});
   // var queryresult = await updateservicetype(id, {clinic});
   const { firstName, lastName } = (req.user).user;
   var actor = `${firstName} ${lastName}`;    
   await createaudit({action:"Updated Service Type",actor,affectedentity:queryresult.servicecategory});
   res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }
  //get pharmacy service type
export async function getpharmacyservicetype(req:Request, res:any){
  try{
     
      const queryresult = await readoneservicetype({category: configuration.category[1]},'');
      res.status(200).json({
          queryresult,
          status:true
        }); 

  }
  catch(e:any){
      res.status(403).json({status: false, msg:e.message});

  }

}


  
  
/*
if(foundservicetype){
          for(var i =0; i < servicetype.length; i++){
            if((foundservicetype.type).includes(servicetype[i]))
            throw new Error(`${servicetype[i]} ${configuration.error.erroralreadyexit}`);

        }
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
