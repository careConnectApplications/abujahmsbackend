import configuration from "../../config";
import  {readallclinics,createclinic,readoneclinic,updateclinic}  from "../../dao/clinics";
import { validateinputfaulsyvalue,generateRandomNumber} from "../../utils/otherservices";
//add patiient
export var createclinics = async (req:any,res:any) =>{
   
    try{
     
       const {clinic,type} = req.body;
       validateinputfaulsyvalue({clinic,type});
       var id = `${clinic[0]}${generateRandomNumber(5)}${clinic[clinic.length -1]}`;
        //validate that category is in the list of accepted category
        //get token from header
        /*
        var settings = await configuration.settings();
        if(req.body.servicecategory == settings.servicecategory[0]){
          req.body.servicetype=settings.servicecategory[0]
        }
          */
        
        //validation
        
        const foundClinic =  await readoneclinic({clinic},'');
        //update servicetype for New Patient Registration
       
        console.log(foundClinic);
        if(foundClinic){
            throw new Error(`clinic ${configuration.error.erroralreadyexit}`);

        }
         const queryresult=await createclinic({clinic, id});
        res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}

//read all patients
export async function getallclinic(req:Request, res:any){
    try{
       
        const queryresult = await readallclinics({},'');
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
export async function updateclinics(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    const {clinic} = req.body;
    validateinputfaulsyvalue({clinic,id});
    var queryresult = await updateclinic(id, {clinic});
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
