import configuration from "../../config";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import  {readallpatient,createpatient,updatepatient,readonepatient}  from "../../dao/patientmanagement";
import {readoneprice} from "../../dao/price";
import {createpayment} from "../../dao/payment";
import { mail, generateRandomNumber,validateinputfaulsyvalue,uploaddocument } from "../../utils/otherservices";
//add patiient
export var createpatients = async (req:any,res:any) =>{
   
    try{
      

        //get token from header
        const {phoneNumber,email,title,firstName,lastName,country,stateOfResidence,LGA,age,dateOfBirth,gender,isHMOCover} = req.body;
        //validation
        validateinputfaulsyvalue({phoneNumber,email,title,firstName,lastName,country,stateOfResidence,LGA,age,dateOfBirth,gender,isHMOCover});
        var selectquery ={"title":1,"firstName":1,"middleName":1,"lastName":1,"country":1, "stateOfResidence": 1,"LGA": 1,"address":1,"age":1,"dateOfBirth":1,"gender":1,"nin":1,"phoneNumber":1,"email":1,"oldMRN":1,"nextOfKinName":1,"nextOfKinRelationship":1,"nextOfKinPhoneNumber":1,"nextOfKinAddress":1,
          "maritalStatus":1, "disability":1,"occupation":1,"isHMOCover":1,"HMOName":1,"HMOId":1,"HMOPlan":1,"MRN":1,"createdAt":1, "passport":1};
        const foundUser =  await readonepatient({phoneNumber},selectquery,'');
        if(foundUser){
            throw new Error(`Patient ${configuration.error.erroralreadyexit}`);

        }
        //validate if price is set for patient registration
        var newRegistrationPrice = await readoneprice({servicecategory:configuration.settings.servicecategory[0]});
        if(!newRegistrationPrice){
          throw new Error(configuration.error.errornopriceset);

      }
       
        req.body.MRN=`${generateRandomNumber(4)}-${req.body.phoneNumber}`;        
        req.body.password=configuration.defaultPassword;
        //other validations
        var payment=[];
         const createpatientqueryresult=await createpatient(req.body);
         
         //create payment
         const createpaymentqueryresult =await createpayment({paymentreference:req.body.MRN,paymentype:newRegistrationPrice.servicecategory,patient:createpatientqueryresult._id,amount:Number(newRegistrationPrice.amount)})
         payment.push(createpaymentqueryresult._id);
         //update createpatientquery
         const queryresult =await updatepatient(createpatientqueryresult._id,{payment});

       // const message = `Your account creation on Gotruck APP is successful. \n Login Email: ${email} \n Portal Link: https://google.com/ \n Default-Password: truck \n Please Login and change your Password`;
        //await mail(email, "Account Registration Confrimation", message);
        res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
      console.log(error);
        res.status(403).json({ status: false, msg: error.message });
    }
}
//read all patients
export async function getallpatients(req:Request, res:any){
    try{
        var selectquery ={"title":1,"firstName":1,"middleName":1,"lastName":1,"country":1, "stateOfResidence": 1,"LGA": 1,"address":1,"age":1,"dateOfBirth":1,"gender":1,"nin":1,"phoneNumber":1,"email":1,"oldMRN":1,"nextOfKinName":1,"nextOfKinRelationship":1,"nextOfKinPhoneNumber":1,"nextOfKinAddress":1,
            "maritalStatus":1, "disability":1,"occupation":1,"isHMOCover":1,"HMOName":1,"HMOId":1,"HMOPlan":1,"MRN":1,"createdAt":1, "passport":1};
        var populatequery ={
            path: "payment",
            match: { paymentype: { $eq: configuration.paymenttype[0] } },
            select: {
              status: 1,
              paymentype:1
            },
          };
        const queryresult = await readallpatient({},selectquery,populatequery);
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}
//get record for a particular patient
export async function getonepatients(req:any, res:any){
  const {id} = req.params;
  try{
    var selectquery ={"title":1,"firstName":1,"middleName":1,"lastName":1,"country":1, "stateOfResidence": 1,"LGA": 1,"address":1,"age":1,"dateOfBirth":1,"gender":1,"nin":1,"phoneNumber":1,"email":1,"oldMRN":1,"nextOfKinName":1,"nextOfKinRelationship":1,"nextOfKinPhoneNumber":1,"nextOfKinAddress":1,
      "maritalStatus":1, "disability":1,"occupation":1,"isHMOCover":1,"HMOName":1,"HMOId":1,"HMOPlan":1,"MRN":1,"createdAt":1, "passport":1};
      var populatequery ='payment';
      const queryresult = await readonepatient({_id:id},selectquery,populatequery);
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


//update a patient
export async function updatepatients(req:any, res:any){
    try{
    //get id
    const {id, status} = req.params;
    if(status){

    }
    var queryresult = await updatepatient(id, req.body);
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }
  //upload patients photo
  export var uploadpix = async (req:any, res:any)=>{
    try{
      
        const file = req.files.file;
        const fileName = file.name;
        const filename= "patientpassport" + uuidv4();
        let allowedextension = ['.jpg','.png','.jpeg'];
        let uploadpath =`${process.cwd()}/${configuration.useruploaddirectory}`;
        const extension = path.extname(fileName);
        const renamedurl= `${filename}${extension}`;
        console.log(renamedurl);
       
        //upload pix to upload folder
        await uploaddocument(file,filename,allowedextension,uploadpath);
        const {id} = req.params;
      
        //update pix name in patient
        const queryresult =await updatepatient(id,{passport:renamedurl});
        res.json({
            queryresult,
            status:true
          });
          

    }
    catch(e:any){
        /*
        logger.error(e.message);
        res.json({status: false, msg:e.message});
        */
    }

}

