import configuration from "../../config";
import  {readallprices,createprice,updateprice,readoneprice}  from "../../dao/price";
import { validateinputfaulsyvalue} from "../../utils/otherservices";
//add patiient
export var createprices = async (req:any,res:any) =>{
   
    try{
    
       var {servicecategory,amount,servicetype,isHMOCover} = req.body;
      if(!isHMOCover){
        isHMOCover =configuration.ishmo[0];
      }

       
        //validate that category is in the list of accepted category
        /*
        if(!((configuration.settings.servicecategory).includes(servicecategory))){
          throw new Error(configuration.error.errorservicecategory);

        }
          */

        //get token from header
       // var settings =await configuration.settings();
        if(req.body.servicecategory == configuration.category[3]){
          req.body.servicetype=configuration.category[3]
        }
       
        //validation
        validateinputfaulsyvalue({servicecategory,amount,servicetype});
        const foundPrice =  await readoneprice({servicecategory,servicetype,isHMOCover});
        //update servicetype for New Patient Registration
       
       
        if(foundPrice){
            throw new Error(`service category and type ${configuration.error.erroralreadyexit}`);

        }
         const queryresult=await createprice(req.body);
        res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}
//read all patients
export async function getallprices(req:Request, res:any){
    try{
       
        const queryresult = await readallprices({});
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
export async function updateprices(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    var queryresult = await updateprice(id, req.body);
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

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

