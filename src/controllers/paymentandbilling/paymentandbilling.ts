import {readallpayment,readonepayment,updatepayment,updatepaymentbyquery,readallpaymentaggregate,readpaymentaggregate} from "../../dao/payment";
import {updateappointmentbyquery} from "../../dao/appointment";
import {updatepatientbyanyquery,readonepatient} from "../../dao/patientmanagement";
import {updatelabbyquery} from "../../dao/lab";
import configuration from "../../config";
import {validateinputfaulsyvalue} from "../../utils/otherservices";
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
   //confirm payment
export async function confirmgrouppayment(req:any, res:any){
  //console.log(req.user);
  try{
    const {paymentreferenceid} = req.params;
    //check for null of id
      const response:any = await readallpayment({paymentreference:paymentreferenceid, status:configuration.status[2]},'');
      const {paymentdetails} = response;
      console.log('before',paymentdetails);
      console.log('length',paymentdetails.length);

      for(var i =0;i < paymentdetails.length; i++ ){
        console.log('paymentdetails',paymentdetails[i])
        let  {paymentype,paymentcategory,paymentreference,patient,_id}= paymentdetails[i]

        //const {patient} = paymentdetails[i];
      const patientrecord =  await readonepatient({_id:patient,status:configuration.status[1]},{},'','');
      console.log('patient', patientrecord);
      if(!patientrecord && paymentcategory !== configuration.category[3] ){
        console.log('true');
        throw new Error(`Patient donot ${configuration.error.erroralreadyexit} or has not made payment for registration`);

    }
    //var settings =await  configuration.settings();
    const status= configuration.status[3];
    const {email, staffId} = (req.user).user;
    const queryresult:any =await updatepayment(_id,{status,cashieremail:email,cashierid:staffId});
    //const {paymentype,paymentcategory,paymentreference} = queryresult;
      //for patient registration
      if(paymentcategory == configuration.category[3]){
        //update patient registration status
        await updatepatientbyanyquery({_id:patient},{status:configuration.status[1]});


      }
      
      else if(paymentcategory == configuration.category[0]){
        //schedule the patient
        //payment
        await updateappointmentbyquery({payment:_id},{status:configuration.status[5]});

      }
        
      //for lab test
      else if (paymentcategory == configuration.category[2]){
        //update lab test
        await updatelabbyquery({payment:_id},{status:configuration.status[5]})
      }
      
  }
      
      res.status(200).json({
          queryresult:paymentreferenceid,
          status:true
        }); 
        

  }
  catch(e:any){
      console.log(e);
    res.status(403).json({status: false, msg:e.message});

  }

}

export async function readpaymentbyreferencenumber(req: any, res: any) {
  //
  try {
    const { paymentreference } = req.params;
    //validate ticket id
    validateinputfaulsyvalue({
      paymentreference,
   
    });
    
    var populatequery ='patient';
   const queryresult = await readallpayment({paymentreference},populatequery);
  
    res.json({
      queryresult,
      status: true,
    });
  } catch (e: any) {
    console.log(e);
    res.status(403).json({status: false, msg:e.message});
  }
}
//recall

export async function groupreadallpayment(req: any, res: any) {
  try {
    //const { paymentreference } = req.params;
    const referencegroup = [
     //look up patient
     {
      $lookup: {
        from: "patientsmanagements",
        localField: "patient",
        foreignField: "_id",
        as: "patient",
      },
    },
      {
        $group: {
          _id: "$paymentreference",
          paymentreference: {$first: "$paymentreference"},
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          amount: { $sum: "$amount" },
          patient:{$first: "$patient"}   
        },
      },
      {
        $project:{
          _id:0,
          paymentreference:1,
          createdAt:1,
          updatedAt:1,
          amount:1,
          patient:1

        }
      },
      
      { $sort: { createdAt: -1 } },
      
      
    ];
    const queryresult = await readpaymentaggregate(referencegroup);
    res.json({
      queryresult,
      status: true,
    });

    
  } catch (e: any) {
    console.log(e);
    res.status(403).json({status: false, msg:e.message});
  }
}
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
  try{
    const {id} = req.params;
    //check for null of id
      const response:any = await readonepayment({_id:id});
      const {patient} = response;
      const patientrecord =  await readonepatient({_id:patient,status:configuration.status[1]},{},'','');
      console.log('patient', patientrecord);
      if(!patientrecord && response.paymentcategory !== configuration.category[3] ){
        throw new Error(`Patient donot ${configuration.error.erroralreadyexit} or has not made payment for registration`);

    }

    //var settings =await  configuration.settings();
     const status= configuration.status[3];
     const {email, staffId} = (req.user).user;
     const queryresult:any =await updatepayment(id,{status,cashieremail:email,cashierid:staffId});
      //const queryresult:any =await updatepayment(id,{status});
      //confirm payment of the service paid for 
      const {paymentype,paymentcategory,paymentreference} = queryresult;
      //for patient registration
      if(paymentcategory == configuration.category[3]){
        //update patient registration status
        await updatepatientbyanyquery({_id:patient},{status:configuration.status[1]});


      }
      
      //for appointment
      else if(paymentcategory == configuration.category[0]){
        //schedule the patient
        //payment
        await updateappointmentbyquery({payment:id},{status:configuration.status[5]});

      }
      
      //for lab test
      else if (paymentcategory == configuration.category[2]){
        //update lab test
        await updatelabbyquery({payment:id},{status:configuration.status[5]})
      }
      //update for pharmacy
      
      

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

//print receipt
export async function printreceipt(req:any, res:any){
  try{
  const { paymentreference } = req.params;
  const { firstName,lastName} = (req.user).user;
  var staffname = `${firstName} ${lastName}`;
//paymentreference
  var query ={paymentreference, status:configuration.status[3]};
  var populatequery ='patient';
 let queryresult:any = await readallpayment({paymentreference, status:configuration.status[3]},populatequery);  
 //get total sum
 // Aggregation to calculate sum and add it as a new field
 let totalAmount = await readallpaymentaggregate([
  {
    $match: query
  },
  {
    $group: {
      _id: null, // null means no grouping, we just want the total sum for the entire collection
      totalAmount: { $sum: "$amount" } // Sum of the itemPrice for all documents
    }
  },
  {
    $project:{
      totalAmount:1,
      _id:0
    }
  }

 ]);

 //update numberoftimesprinted
 await updatepaymentbyquery(query,{$inc:{numberoftimesprinted: 1}});
 res.json({
   queryresult,
   totalAmount,
   printedbystaffname:staffname,
   status: true,
 });
}
 catch(e:any){
  console.log(e);
  res.status(403).json({status: false, msg:e.message});

}

}