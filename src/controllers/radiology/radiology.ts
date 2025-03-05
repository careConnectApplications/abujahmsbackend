import { validateinputfaulsyvalue,uploaddocument } from "../../utils/otherservices";
import  {readonepatient,updatepatient}  from "../../dao/patientmanagement";
import  {readallservicetype}  from "../../dao/servicetype";
import {createradiology, readallradiology,updateradiology,readoneradiology} from "../../dao/radiology";
import {readoneprice} from "../../dao/price";
import {createpayment,updatepayment,readonepayment} from "../../dao/payment";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';




import configuration from "../../config";
//lab order
export var radiologyorder= async (req:any, res:any) =>{
    try{
      
      //accept _id from request
      const {id} = req.params;
      const {testname,note} = req.body;
      const { firstName,lastName} = (req.user).user;
      const raiseby = `${firstName} ${lastName}`;
      var testid:any=String(Date.now());
      var testsid =[];
      //var paymentids =[];
      validateinputfaulsyvalue({id, testname,note});
      //find the record in appointment and validate
      const foundPatient:any =  await readonepatient({_id:id},{},'','');
      const {isHMOCover} = foundPatient;
      //category
      if(!foundPatient){
          throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);

      }
           
  const {servicetypedetails} = await readallservicetype({category: configuration.category[4]},{type:1,category:1,department:1,_id:0});
   console.log(isHMOCover);
  //loop through all test and create record in lab order
      for(var i =0; i < testname.length; i++){
      
    //search for price of test name
        var testPrice:any = await readoneprice({servicetype:testname[i],isHMOCover});
        if(!testPrice){
          throw new Error(`${configuration.error.errornopriceset}  ${testname[i]}`);
      }
      
      //search testname in setting
      console.log(servicetypedetails);
      var testsetting = servicetypedetails.filter(item => (item.type).includes(testname[i]));
     /* 
      if(!testsetting || testsetting.length < 1){
        throw new Error(`${testname[i]} donot ${configuration.error.erroralreadyexit} in ${configuration.category[4]} as a service type  `);
    }
        */
         //create payment
      //var createpaymentqueryresult =await createpayment({paymentreference:id,paymentype:testname[i],paymentcategory:testsetting[0].category,patient:id,amount:Number(testPrice.amount)})
     
      //create testrecordn 
      var testrecord = await createradiology({note,testname:testname[i],patient:id,testid,department:testsetting[0].department,raiseby,amount:Number(testPrice.amount)});
      testsid.push(testrecord._id);
      //paymentids.push(createpaymentqueryresult._id);
      }
      var queryresult=await updatepatient(id,{$push: {radiology:testsid}});
      res.status(200).json({queryresult, status: true});
      
     
  
    }
    catch(error:any){
      console.log("error", error);
      res.status(403).json({ status: false, msg: error.message });
  
    }
  
  }


  //get lab order by patient
    export const readAllRadiologyByPatient = async (req:any, res:any) => {
      try {
     
        const {id} = req.params;
        const queryresult = await readallradiology({patient:id},{},'patient','payment');
        res.status(200).json({
          queryresult,
          status:true
        }); 
      } catch (error:any) {
        res.status(403).json({ status: false, msg: error.message });
      }
    };
     //get lab order 
     export const readAllRadiology = async (req:any, res:any) => {
      try {
        const queryresult = await readallradiology({},{},'patient','payment');
        res.status(200).json({
          queryresult,
          status:true
        }); 
      } catch (error:any) {
        res.status(403).json({ status: false, msg: error.message });
      }
    };

    //update radiology
    export async function updateradiologys(req:any, res:any){
        try{
   
        //get id
        const {id} = req.params;
                  //check that the status is not complete
        var myradiologystatus:any = await readoneradiology({_id:id},{},'patient');
        if(myradiologystatus.status !== configuration.status[13]){
          throw new Error(`${configuration.error.errortasknotpending} `);
      }
        var { testname,note} = req.body;
        validateinputfaulsyvalue({testname,note});
        var testPrice:any = await readoneprice({servicetype:testname});
        if(!testPrice){
          throw new Error(`${configuration.error.errornopriceset}  ${testname}`);
      }
      const {servicetypedetails} = await readallservicetype({category: configuration.category[4]},{type:1,category:1,department:1,_id:0});
      var testsetting = servicetypedetails.filter(item => (item.type).includes(testname));
      
      if(!testsetting || testsetting.length < 1){
        throw new Error(`${testname} donot ${configuration.error.erroralreadyexit} in ${configuration.category[4]} as a service type  `);
    }
 
   
    

   // await updatepayment({_id:myradiologystatus.payment},{paymentype:testname,amount:Number(testPrice.amount)});
    var queryresult = await updateradiology(id, {testname,note});
        //update price

        res.status(200).json({
            queryresult,
            status:true
          }); 
        }catch(e:any){
          console.log(e);
          res.status(403).json({status: false, msg:e.message});
    
        }
    
      }
    //process result
    //upload patients photo
  export var uploadradiologyresult = async (req:any, res:any)=>{
    try{
      const { firstName,lastName} = (req.user).user;
      const {id} = req.params;
      var response:any = await readoneradiology({_id:id},{},'');
      //validate payment
      var paymentrecord:any = await readonepayment({_id:response.payment});
   
    if(paymentrecord.status !== configuration.status[3]){
      throw new Error(configuration.error.errorpayment);

    }

      const processby = `${firstName} ${lastName}`;
        const file = req.files.file;
        const fileName = file.name;
        const filename= "radiology" + uuidv4();
        let allowedextension = ['.jpg','.png','.jpeg','.pdf'];
        let uploadpath =`${process.cwd()}/${configuration.useruploaddirectory}`;
        const extension = path.extname(fileName);
        const renamedurl= `${filename}${extension}`;
        //upload pix to upload folder
        await uploaddocument(file,filename,allowedextension,uploadpath);
       
      
        //update pix name in patient
        const queryresult =await updateradiology(id,{$push:{testresult:renamedurl}, status:configuration.status[7],processby});
        res.json({
            queryresult,
            status:true
          });
          

    }
    catch(e:any){
      
        
        //logger.error(e.message);
        res.json({status: false, msg:e.message});
        
    }

}

//confirm radiology order
//this endpoint is use to accept or reject lab order
export const confirmradiologyorder = async (req:any, res:any) =>{
  try{
    //extract option
    const {option,remark} = req.body;
    const {id} = req.params;
  //search for the lab request
  var radiology:any =await readoneradiology({_id:id},{},'');
  const {testname, testid,patient,amount} = radiology;
  //validate the status
  let queryresult;
  if(option == true){
    var createpaymentqueryresult =await createpayment({paymentreference:testid,paymentype:testname,paymentcategory:configuration.category[4],patient,amount});
  queryresult= await updateradiology({_id:id},{status:configuration.status[9],payment:createpaymentqueryresult._id,remark});
    await updatepatient(patient,{$push: {payment:createpaymentqueryresult._id}});
    
  }
  else{
    queryresult= await updateradiology({_id:id},{status:configuration.status[13], remark});

  }
  res.status(200).json({queryresult, status: true});
    //if accept
//accept or reject lab order
//var createpaymentqueryresult =await createpayment({paymentreference:id,paymentype:testname[i],paymentcategory:testsetting[0].category,patient:appointment.patient,amount:Number(testPrice.amount)})
//paymentids.push(createpaymentqueryresult._id);
//var queryresult=await updatepatient(appointment.patient,{$push: {payment:paymentids}});
//var testrecord = await createlab({payment:createpaymentqueryresult._id});
//change status to 2 or  13 for reject

  }
  catch(e:any){
    console.log("error", e);
    res.status(403).json({ status: false, msg: e.message });

  }
}

