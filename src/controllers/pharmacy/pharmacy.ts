//lab order
/*
export var pharmacyorder= async (req:any, res:any) =>{
    try{
      //accept _id from request
      const {id} = req.params;
      const {testname} = req.body;
      var testid:any=String(Date.now());
      var testsid =[];
      var paymentids =[];
      validateinputfaulsyvalue({id, testname});
      //find the record in appointment and validate
      var appointment = await readoneappointment({_id:id},{},'');
      if(!appointment){
        throw new Error(`Appointment donot ${configuration.error.erroralreadyexit}`);
  
    }
   
  
      //loop through all test and create record in lab order
      for(var i =0; i < testname.length; i++){
    //    console.log(testname[i]);
        var testPrice:any = await readoneprice({servicetype:testname[i]});
        if(!testPrice){
          throw new Error(configuration.error.errornopriceset);
      }
      //search testname in setting
      var testsetting = (configuration.settings.servicecategory).filter(item => (item.type).includes(testname[i]));
         //create payment
      var createpaymentqueryresult =await createpayment({paymentreference:id,paymentype:testname[i],paymentcategory:testsetting[0].category,patient:appointment.patient,amount:Number(testPrice.amount)})
      //create testrecord
      var testrecord = await createlab({testname:testname[i],patient:appointment.patient,appointment:appointment._id,payment:createpaymentqueryresult._id,appointmentid:appointment.appointmentid,testid,department:testsetting[0].department});
      testsid.push(testrecord._id);
      paymentids.push(createpaymentqueryresult._id);
      }
      var queryresult=await updatepatient(appointment.patient,{$push: {lab:testsid,payment:paymentids}});
      res.status(200).json({queryresult, status: true});
      
     
  
    }
    catch(error:any){
      res.status(403).json({ status: false, msg: error.message });
  
    }
  
  }
    */