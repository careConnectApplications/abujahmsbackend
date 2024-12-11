import configuration from "../../config";
import  {readone,createuser}  from "../../dao/users";
import { isValidPassword, sendTokenResponse, mail } from "../../utils/otherservices";
//const Webuser = require("../models/webusers");
//const {v4 : uuidv4} = require('uuid');
//const {mail} = require("../services");
//const path = require('path');
//const {sendTokenResponse} = require("../services");

//sign in
export var signin = async(req:any,res:any) =>{
    try{
        //destructure email and password
        const {email, password} = req.body;
   
        //validate email and password
        if(!email || !password){
            throw new Error(configuration.error.errornoemailpassword);
        } 
        //find user
        
        const user = await readone({email});
        //check if user exit
        if(!user){
            throw new Error(configuration.error.errorinvaliduser);
        }

        
        //chek if user is active
        if(user.status === configuration.userstatus[0]){
          throw new Error(configuration.error.errordeactivate);

        }
        
        //check if password match
        const isMatch = await isValidPassword(password, user.password);
        if(!isMatch){
            throw new Error(configuration.error.errorpasswordmismatch);
        }
//respond with token
var queryresult = sendTokenResponse(user);
res.status(200).json({queryresult, status: true});
    }
    catch(error:any){
        res.status(403).json({ status: false, msg: error.message });

    }
}


//signup users 
export var signup = async (req:any,res:any) =>{
   
    try{
        //get token from header
        const {email} = req.body;
        const foundUser =  await readone({email});
        if(foundUser){
            return res.status(403).json({status:false, msg:"User with this email or password already exist"});

        }
        //other validations
         const queryresult=await createuser(req.body)
        const message = `Your account creation on Gotruck APP is successful. \n Login Email: ${email} \n Portal Link: https://google.com/ \n Default-Password: truck \n Please Login and change your Password`;
        await mail(email, "Account Registration Confrimation", message);
        res.status(200).json({queryresult, status: true});
        

    }catch(err){
        return res.status(403).json({status: false, msg:"Authentication Server is Down Please Contact administrator"});
    }
}






