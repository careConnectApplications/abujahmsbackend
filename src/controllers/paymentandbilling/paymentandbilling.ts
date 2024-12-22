import {readallpayment,readonepayment,updatepayment} from "../../dao/payment";
import {updateappointmentbyquery} from "../../dao/appointment";
import {updatepatientbyanyquery} from "../../dao/patientmanagement";
import configuration from "../../config";
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
   
//confirm payment
export async function confirmpayment(req:any, res:any){
  //console.log(req.user);
 ;
  try{
    const {id} = req.params;
    //check for null of id
      const response = await readonepayment({_id:id});
      console.log(response);
     const status= configuration.status[3];
  //   const {email, staffId} = req.user;
      //const queryresult:any =await updatepayment(id,{status,cashieremail:email,cashierid:staffId});
      const queryresult:any =await updatepayment(id,{status});
      //confirm payment of the service paid for 
      const {paymentype,paymentcategory,paymentreference,patient} = queryresult;
      //for patient registration
      if(paymentcategory == configuration.settings.servicecategory[0].category){
        //update patient registration status
        await updatepatientbyanyquery({_id:patient},{status:configuration.status[1]});


      }
      //for appointment
      else if(paymentcategory == configuration.settings.servicecategory[1].category){
        //payment
        await updateappointmentbyquery({payment:id},{status:configuration.status[5]});

      }
      
      

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

