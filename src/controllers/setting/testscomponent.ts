/*
testsubcomponent:[
      {type:"widal", subcomponent:["Salmonella Typhi A (O) (H)","Salmonella Paratyphi A (O) (H)","Salmonella Paratyphi B (O) (H)","Salmonella Paratyphi C (O) (H)","Diagnostic Titre","Monocytes","Eosinophils","Basophils","Comments"]},
      {type:"PCV", subcomponent:["PCV%"]},
      {type:"ESR", subcomponent:["ESR (mm/hr)"]},
      {type:"Clothing Profile", subcomponent:["PT (Seconds)","APTT (Seconds)","INR"]},
      {type:"combo Test", subcomponent:["HbsAg","HbsAb","HbeAg","HbeAb","HbcAb"]},
*/


import configuration from "../../config";
import  {createtestcomponent, readonetestcomponent, readalltestcomponent,updatetestcomponent}  from "../../dao/testcomponent";
import { validateinputfaulsyvalue,generateRandomNumber} from "../../utils/otherservices";
//add patiient
export var createtestcomponents = async (req:any,res:any) =>{
   
    try{
     
       const {testname,subcomponients} = req.body;
       // 
       //validate service category
       validateinputfaulsyvalue({testname,subcomponients});

       // validate that testname exist in lab service type

      
        
        //validation
        
        const foundtestname =  await readonetestcomponent({testname},'');
        //update servicetype for New Patient Registration
      
        if(foundtestname){
         
            throw new Error(`Test name ${configuration.error.erroralreadyexit}`);

        
      }
    
         const queryresult=await createtestcomponent({testname,subcomponients});
  
        res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}

//read all service type
export async function getalltestcomponent(req:Request, res:any){
    try{
       
        const queryresult = await readalltestcomponent({},'');
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}

export async function gettestcomponentbytestname(req:any, res:any){
  try{
      const {testname} = req.params;
      const queryresult = await readalltestcomponent({testname},'');
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
export async function updatetestcomponents(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const {testname,subcomponients} = req.body;
    validateinputfaulsyvalue({testname,subcomponients});
    const foundtestname =  await readonetestcomponent({_id:id},'');
    //update servicetype for New Patient Registration
  
    if(!foundtestname){
     
        throw new Error(`Test name ${configuration.error.errornotfound}`);

    
  }
 
   
  var queryresult=await updatetestcomponent({_id:id},{testname,subcomponients});
   // var queryresult = await updateservicetype(id, {clinic});
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
/*
export async function gettestcomponent(req:Request, res:any){
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
  */



  
  
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
