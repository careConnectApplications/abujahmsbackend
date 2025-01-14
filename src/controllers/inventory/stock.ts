import path from "path";
import configuration from "../../config";
import  {readall,updateuser,readone,createuser}  from "../../dao/users";
import {uploaddocument,convertexceltojson,validateinputfaulsyvalue} from "../../utils/otherservices";


//bulk upload users
export async function bulkuploadinventory(req:any, res:any){
    try{  
      const file = req.files.file;
      const filename= configuration.pharmacyuploadfilename;
      let allowedextension = ['.csv','.xlsx'];
      let uploadpath =`${process.cwd()}/${configuration.useruploaddirectory}`;
      var columnmapping={
        A: "name",
        B: "category",
        C: "qty",
        D: "lowstocklevel",
        E: "expirationdate",
        F: "price",
      };
    
    await uploaddocument(file,filename,allowedextension,uploadpath);
     //convert uploaded excel to json
     var convert_to_json = convertexceltojson(`${uploadpath}/${filename}${path.extname(file.name)}`, configuration.usertemplate, columnmapping);
    console.log(convert_to_json);
     //save to database
    /*var {userslist} = convert_to_json;
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
         */
      }
      catch(e:any){
         //logger.error(e.message);
         res.status(403).json({status: false, msg:e.message});
  
      }
  }