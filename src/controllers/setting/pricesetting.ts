import { NextFunction, Request, Response } from "express";
import configuration from "../../config";
import  {readallprices,createprice,updateprice,readoneprice}  from "../../dao/price";
import { validateinputfaulsyvalue,calculateAmountPaidByHMO} from "../../utils/otherservices";
import {createaudit} from "../../dao/audit";
import {readonepricemodel} from "../../dao/pricingmodel";
import {readonepatient} from "../../dao/patientmanagement";
import catchAsync from "../../utils/catchAsync";
import {readonehmocategorycover} from "../../dao/hmocategorycover";

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
       const foundPricingmodel:any =  await readonepricemodel({pricingtype:configuration.pricingtype[1]});

        if(req.body.servicecategory == configuration.category[3] && !foundPricingmodel){
          req.body.servicetype=configuration.category[3]
        }
       
        //validation
        validateinputfaulsyvalue({servicecategory,amount,servicetype});
        const foundPrice =  await readoneprice({servicecategory,servicetype,isHMOCover});
        //update servicetype for New Patient Registration
       
       
        if(foundPrice){
            throw new Error(`service category and type already exists`);

        }
         const queryresult=await createprice(req.body);
         const { firstName, lastName } = (req.user).user;
         var actor = `${firstName} ${lastName}`;
         await createaudit({action:"Created Price",actor,affectedentity:servicetype});
         res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}
//read all patients
export async function getallprices(req:Request, res:any){
    try{
       
        const queryresult = await readallprices({},{});
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
    const { firstName, lastName } = (req.user).user;
    var actor = `${firstName} ${lastName}`;
    var queryresult = await updateprice(id, req.body);
    await createaudit({action:"Updated Price",actor,affectedentity:queryresult.servicetype});
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

export async function searchtest(req:any, res:any){
  try{
    const {searchparams} = req.params;
    const queryresult = await readallprices({servicecategory:configuration.category[2],servicetype: { $regex:searchparams , $options: 'i' }},{servicetype:1,_id:0});
    res.status(200).json({
        queryresult:queryresult.pricedetails,
        status:true
      }); 

}
catch(e:any){
    res.status(403).json({status: false, msg:e.message});

}
  
}
//search procedure
export async function searchprocedure(req:any, res:any){
  try{
    const {searchparams} = req.params;
    const queryresult = await readallprices({servicecategory:configuration.category[5],servicetype: { $regex:searchparams , $options: 'i' }},{servicetype:1,_id:0});
    res.status(200).json({
        queryresult:queryresult.pricedetails,
        status:true
      }); 

}
catch(e:any){
    res.status(403).json({status: false, msg:e.message});

}
  
}
//search radiology
//search procedure
export async function searchradiology(req:any, res:any){
  try{
    const {searchparams} = req.params;
    const queryresult = await readallprices({servicecategory:configuration.category[4],servicetype: { $regex:searchparams , $options: 'i' }},{servicetype:1,_id:0});
    res.status(200).json({
        queryresult:queryresult.pricedetails,
        status:true
      }); 

}
catch(e:any){
    res.status(403).json({status: false, msg:e.message});

}
  
}
//get price of services /////////////
export const getpriceofservice = catchAsync(async (req: Request | any, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { servicetype } = req.body;

  // Validate inputs early
  if (!id || !servicetype) {
    throw new Error("Patient ID and service type are required.");
  }

  // Fetch patient with insurance populated
  const foundPatient: any = await readonepatient(
    { _id: id },
    {},
    "insurance",
    ""
  );

  if (!foundPatient) {
    throw new Error(`Patient does not exist`);
  }

  // Fetch price for the service type
  const price: any = await readoneprice({ servicetype });

  if (price?.amount == null) {
    throw new Error(`${configuration.error.errornopriceset} ${servicetype}`);
  }

  // Get HMO coverage percentage or default to 0
  let insurance:any = await readonehmocategorycover({hmoId:foundPatient?.insurance?._id, category:price.servicecategory},{hmopercentagecover:1});
  const hmoPercentageCover =insurance?.hmopercentagecover ?? 0;

  // Calculate patient amount
  const amount = calculateAmountPaidByHMO(
    Number(hmoPercentageCover),
    Number(price.amount)
  );

  // Respond with calculated amount
  res.status(200).json({ price: amount, status: true });



      
  })
  