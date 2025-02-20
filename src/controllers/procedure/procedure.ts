import { validateinputfaulsyvalue,uploaddocument } from "../../utils/otherservices";
import  {readonepatient,updatepatient}  from "../../dao/patientmanagement";
import  {readallservicetype}  from "../../dao/servicetype";
import {createprocedure, readallprocedure,updateprocedure,readoneprocedure} from "../../dao/procedure";
import {readoneprice} from "../../dao/price";
import {createpayment,updatepayment} from "../../dao/payment";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';




import configuration from "../../config";
//lab order
export var scheduleprocedureorder= async (req:any, res:any) =>{
    try{
      //accept _id from request
      const {id} = req.params;
      const {procedure,clinic,indicationdiagnosisprocedure,appointmentdate,cptcodes,dxcodes} = req.body;
  
      const { firstName,lastName} = (req.user).user;
      const raiseby = `${firstName} ${lastName}`;
      var procedureid:any=String(Date.now());
      var proceduresid =[];
      var paymentids =[];
      validateinputfaulsyvalue({id, procedure});
      //find the record in appointment and validate
      const foundPatient:any =  await readonepatient({_id:id},{},'','');
      //category
      if(!foundPatient){
          throw new Error(`Patient donot ${configuration.error.erroralreadyexit}`);

      }
           
  const {servicetypedetails} = await readallservicetype({category: configuration.category[5]},{type:1,category:1,department:1,_id:0});
      //loop through all test and create record in lab order
      for(var i =0; i < procedure.length; i++){
    //search for price of test name
        var testPrice:any = await readoneprice({servicetype:procedure[i]});
        if(!testPrice){
          throw new Error(`${configuration.error.errornopriceset}  ${procedure[i]}`);
      }
      
      //search testname in setting
      console.log(servicetypedetails);
      
      var testsetting = servicetypedetails.filter(item => (item.type).includes(procedure[i]));
      
      if(!testsetting || testsetting.length < 1){
        throw new Error(`${procedure[i]} donot ${configuration.error.erroralreadyexit} in ${configuration.category[4]} as a service type  `);
    }
         //create payment
      var createpaymentqueryresult =await createpayment({paymentreference:id,paymentype:procedure[i],paymentcategory:testsetting[0].category,patient:id,amount:Number(testPrice.amount)})
     
      //create testrecordn 
      var procedurerecord = await createprocedure({procedure:procedure[i],patient:id,payment:createpaymentqueryresult._id,procedureid,clinic,indicationdiagnosisprocedure,appointmentdate,cptcodes,dxcodes,raiseby});
      proceduresid.push(procedurerecord._id);
      paymentids.push(createpaymentqueryresult._id);
      }
      var queryresult=await updatepatient(id,{$push: {prcedure:proceduresid,payment:paymentids}});
      res.status(200).json({queryresult, status: true});
      
     
  
    }
    catch(error:any){
      console.log("error", error);
      res.status(403).json({ status: false, msg: error.message });
  
    }
  
  }


  //get lab order by patient
    export const readAllprocedureByPatient = async (req:any, res:any) => {
      try {
     
        const {id} = req.params;
        const queryresult = await readallprocedure({patient:id},{},'patient','payment');
        res.status(200).json({
          queryresult,
          status:true
        }); 
      } catch (error:any) {
        res.status(403).json({ status: false, msg: error.message });
      }
    };

    //update radiology
    export async function updateprocedures(req:any, res:any){
        try{
        //get id
        const {id} = req.params;
        const {procedure,clinic,indicationdiagnosisprocedure,appointmentdate,cptcodes,dxcodes} = req.body;
        validateinputfaulsyvalue({id, procedure});
        var testPrice:any = await readoneprice({servicetype:procedure});
        if(!testPrice){
          throw new Error(`${configuration.error.errornopriceset}  ${procedure}`);
      }
      const {servicetypedetails} = await readallservicetype({category: configuration.category[5]},{type:1,category:1,department:1,_id:0});
      var testsetting = servicetypedetails.filter(item => (item.type).includes(procedure));
      
      if(!testsetting || testsetting.length < 1){
        throw new Error(`${procedure} donot ${configuration.error.erroralreadyexit} in ${configuration.category[5]} as a service type  `);
    }
 
        //check that the status is not complete
    var myprocedurestatus:any = await readoneprocedure({_id:id},{},'');
    if(myprocedurestatus.status !== configuration.status[9]){
        throw new Error(`${configuration.error.errortasknotpending} `);
    }

    await updatepayment({_id:myprocedurestatus.payment},{paymentype:procedure,amount:Number(testPrice.amount)});
    var queryresult = await updateprocedure(id, {procedure,clinic,indicationdiagnosisprocedure,appointmentdate,cptcodes,dxcodes});
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
  export var uploadprocedureresult = async (req:any, res:any)=>{
    try{
        const { firstName,lastName} = (req.user).user;
        const processby = `${firstName} ${lastName}`;
        const file = req.files.file;
        const {procedureoutcome} = req.body;
        //procedureoutcome
        const fileName = file.name;
        const filename= "procedure" + uuidv4();
        let allowedextension = ['.jpg','.png','.jpeg','.pdf'];
        let uploadpath =`${process.cwd()}/${configuration.useruploaddirectory}`;
        const extension = path.extname(fileName);
        const renamedurl= `${filename}${extension}`;
        //upload pix to upload folder
        await uploaddocument(file,filename,allowedextension,uploadpath);
        const {id} = req.params;
      
        //update pix name in patient
        const queryresult =await updateprocedure(id,{$push:{procedureresult:renamedurl}, status:configuration.status[7],processby,procedureoutcome});
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

