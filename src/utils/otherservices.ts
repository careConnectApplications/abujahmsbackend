import bcrypt from "bcryptjs";
import  jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
export var isValidPassword = async function(newPassword:any, currentpassword:any){
    try{
        return await bcrypt.compare(newPassword, currentpassword);
  
    }
    catch(error){
        console.log(error)
    }
  
  }

  export var sendTokenResponse= (user:any) =>{
    const {firstName, lastName, role, staffId} =user;
    const token= jwt.sign({user: {firstName, lastName, role, staffId}},process.env.KEYGEN as string,{expiresIn:"1d"});
   
    const options ={
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    return {token, options};
   
};

export var mail= async function mail(to:any,subject:any,textmessage:any){
    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth:{
            user: "malachi.egbugha3@gmail.com",
            pass: "Maeg/1987",
        },
        secure: true,
    });
    const mailData = {
        from:'"From HMSB" <noreply@hmsb.com>',
        to: `${to}`,
        subject: `${subject}`,
        text: `${textmessage}`,
    };
    let info = await transporter.sendMail(mailData, function(err, info){
        if(err) console.log(err);
        else console.log(info);

    });
}

