import {readallpayment} from "../../dao/payment";
//deactivate a user
/*
export async function confirmpayment(req:any, res:any){
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
    */
   //read particular patient payment history
export async function readbillinghistoryforapatient(req:any, res:any){
    try{
    const { id } = req.params;
    var query ={patient:id};
    var populatequery ='patient';
   const queryresult = await readallpayment(query,populatequery);

   res.json({
     queryresult,
     status: true,
   });
}
   catch(e:any){
    console.log(e);
  res.status(403).json({status: false, msg:e.message});

}

}
   
//get billing history for all patient
   
   export async function readbillinghistoryforallapatient(req:any, res:any){
    try{
    
    var query ={};
    var populatequery ='patient';
   const queryresult = await readallpayment(query,populatequery);

   res.json({
     queryresult,
     status: true,
   });
}
   catch(e:any){
    console.log(e);
  res.status(403).json({status: false, msg:e.message});

}

}
   