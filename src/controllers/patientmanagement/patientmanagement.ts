import configuration from "../../config";
import  {readallpatient,createpatient,updatepatient,readonepatient}  from "../../dao/patientmanagement";
import { mail, generateRandomNumber } from "../../utils/otherservices";
//add patiient
export var createpatients = async (req:any,res:any) =>{
   
    try{
        //get token from header
        const {phoneNumber,email} = req.body;
        const foundUser =  await readonepatient({phoneNumber});
        if(foundUser){
            throw new Error(configuration.error.erroralreadyexit);

        }
        req.body.MRN=`${generateRandomNumber(4)}-${req.body.phoneNumber}`;        
        req.body.password=configuration.defaultPassword;
        //other validations
         const queryresult=await createpatient(req.body)
        const message = `Your account creation on Gotruck APP is successful. \n Login Email: ${email} \n Portal Link: https://google.com/ \n Default-Password: truck \n Please Login and change your Password`;
        await mail(email, "Account Registration Confrimation", message);
        res.status(200).json({queryresult, status: true});
        

    }catch(error:any){
        res.status(403).json({ status: false, msg: error.message });
    }
}

//update a patient
//