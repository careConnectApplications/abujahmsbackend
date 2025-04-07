import path from "path";
import configuration from "../../config";
import bcrypt from "bcryptjs";
import  {readall,updateuser,readone,createuser}  from "../../dao/users";
import {uploaddocument,convertexceltojson,validateinputfaulsyvalue,encrypt} from "../../utils/otherservices";


//get all users
export async function getallusers(req:Request, res:any){
    try{
        const queryresult = await readall({});
        res.status(200).json({
            queryresult,
            status:true
          }); 

    }
    catch(e:any){
        res.status(403).json({status: false, msg:e.message});

    }

}
//update a user password
  export async function updatepassword(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    var {currentpassword, newpassword} = req.body;
    validateinputfaulsyvalue({currentpassword, newpassword});
    //read user 
    var user:any = await readone({_id:id});
    const {password} = user;
    const isMatch = await bcrypt.compare(currentpassword, password);
    if(!isMatch){
      //return error
      throw new Error(configuration.error.errorinvalidcredentials);
    }
    //change password
    var queryresult = await updateuser(id, {password: newpassword});
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }
export async function passwordreset(req:any, res:any){
  const {id} = req.params;
  try{
      const queryresult:any =await updateuser(id,{password: configuration.defaultPassword});
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
//deactivate a user
export async function updatestatus(req:any, res:any){
    const {id} = req.params;
    try{
        const response = await readone({_id:id});
       const status= response?.status == configuration.status[0]? configuration.status[1]: configuration.status[0];
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

//update a user
  export async function updateusers(req:any, res:any){
    try{
    //get id
    const {id} = req.params;
    //map role to role id
      const {role} = req.body;
            //get role id
            if(role){
            var roleId = (configuration.roles).filter((e) => e.role == role )[0].roleId;
            req.body.roleId = roleId;
            }
    var queryresult = await updateuser(id, req.body);
    res.status(200).json({
        queryresult,
        status:true
      }); 
    }catch(e:any){
      console.log(e);
      res.status(403).json({status: false, msg:e.message});

    }

  }

  //bulk upload users
  export async function bulkuploadusers(req:any, res:any){
  try{  
    const file = req.files.file;
    const filename= configuration.useruploadfilename;
    let allowedextension = ['.csv','.xlsx'];
    let uploadpath =`${process.cwd()}/${configuration.useruploaddirectory}`;
    var columnmapping={
      A: "title",
      B: "staffId",
      C: "firstName",
      D: "middleName",
      E: "lastName",
      F: "country",
      G: "state",
      H: "city",
      I: "address",
      J: "age",
      K: "dateOfBirth",
      L: "gender",
      M: "licence",
      N: "phoneNumber",
      O: "email",
      P: "role",
      Q: "degree",
      R: "profession",
      S: "employmentStatus",
      T: "nativeSpokenLanguage",
      U: "otherLanguage",
      V: "readWriteLanguage",
      W: "clinic",
      X: "zip",
      Y: "specializationDetails",
       
    };
  
  await uploaddocument(file,filename,allowedextension,uploadpath);
   //convert uploaded excel to json
   var convert_to_json = convertexceltojson(`${uploadpath}/${filename}${path.extname(file.name)}`, configuration.usertemplate, columnmapping);
   //save to database
  var {userslist} = convert_to_json;
       if(userslist.length > 0){
        for (var i = 0; i < userslist.length; i++) {        
          const {email,firstName,title,staffId,lastName,country,state,city,address,age,dateOfBirth,gender,licence,phoneNumber,role,degree,profession,employmentStatus,nativeSpokenLanguage,otherLanguage,readWriteLanguage,clinic,zip,specializationDetails} = userslist[i];
          validateinputfaulsyvalue({email,firstName,title,staffId,lastName,country,state,city,address,age,dateOfBirth,gender,licence,phoneNumber,role,degree,profession,employmentStatus,nativeSpokenLanguage,otherLanguage,readWriteLanguage,clinic,zip,specializationDetails});
          const foundUser =  await readone({email});
          if(foundUser){
              throw new Error(`${email} ${configuration.error.erroralreadyexit}`);
  
          }
          userslist[i].password=configuration.defaultPassword;
          //other validations
          await createuser(userslist[i]);
     
      }
       }
      
      
       res.status(200).json({status: true, queryresult: 'Bulk upload was successfull'});
    }
    catch(e:any){
       //logger.error(e.message);
       res.status(403).json({status: false, msg:e.message});

    }
}
    
