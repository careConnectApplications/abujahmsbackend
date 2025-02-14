import { validateinputfaulsyvalue,uploaddocument } from "../../utils/otherservices";
import  {readonepatient,updatepatient}  from "../../dao/patientmanagement";
import  {readallservicetype}  from "../../dao/servicetype";
import {createradiology, readallradiology,updateradiology,readoneradiology} from "../../dao/radiology";
import {readoneprice} from "../../dao/price";
import {createpayment,updatepayment} from "../../dao/payment";
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
      var paymentids =[];
      validateinputfaulsyvalue({id, testname,note});
      //find the record in appointment and validate
      const foundPatient:any =  await readonepatient({_id:id},{},'','');
      //category
      if(!foundPatient){
          throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);

      }
           
  const {servicetypedetails} = await readallservicetype({category: configuration.category[4]},{type:1,category:1,department:1,_id:0});
      //loop through all test and create record in lab order
      for(var i =0; i < testname.length; i++){
    //search for price of test name
        var testPrice:any = await readoneprice({servicetype:testname[i]});
        if(!testPrice){
          throw new Error(`${configuration.error.errornopriceset}  ${testname[i]}`);
      }
      
      //search testname in setting
      console.log(servicetypedetails);
      var testsetting = servicetypedetails.filter(item => (item.type).includes(testname[i]));
      
      if(!testsetting || testsetting.length < 1){
        throw new Error(`${testname[i]} donot ${configuration.error.erroralreadyexit} in ${configuration.category[4]} as a service type  `);
    }
         //create payment
      var createpaymentqueryresult =await createpayment({paymentreference:id,paymentype:testname[i],paymentcategory:testsetting[0].category,patient:id,amount:Number(testPrice.amount)})
     
      //create testrecordn 
      var testrecord = await createradiology({note,testname:testname[i],patient:id,payment:createpaymentqueryresult._id,testid,department:testsetting[0].department,raiseby});
      testsid.push(testrecord._id);
      paymentids.push(createpaymentqueryresult._id);
      }
      var queryresult=await updatepatient(id,{$push: {radiology:testsid,payment:paymentids}});
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

    //update radiology
    export async function updateradiologys(req:any, res:any){
        try{
        //get id
        const {id} = req.params;
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
 
        //check that the status is not complete
    var myradiologystatus:any = await readoneradiology({_id:id},{},'');
    if(myradiologystatus.status !== configuration.status[2]){
        throw new Error(`${configuration.error.errortasknotpending} `);
    }

    await updatepayment({_id:myradiologystatus.payment},{paymentype:testname,amount:Number(testPrice.amount)});
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
        const file = req.files.file;
        const fileName = file.name;
        const filename= "radiology" + uuidv4();
        let allowedextension = ['.jpg','.png','.jpeg','.pdf'];
        let uploadpath =`${process.cwd()}/${configuration.useruploaddirectory}`;
        const extension = path.extname(fileName);
        const renamedurl= `${filename}${extension}`;
        //upload pix to upload folder
        await uploaddocument(file,filename,allowedextension,uploadpath);
        const {id} = req.params;
      
        //update pix name in patient
        const queryresult =await updateradiology(id,{$push:{testresult:renamedurl}});
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

