import path from "path";
import configuration from "../../config";
import  {readall,updateuser,readone,createuser}  from "../../dao/users";
import {createmanyprice,readoneprice,readallprices,createprice} from "../../dao/price";
import {uploaddocument,convertexceltojson,validateinputfaulsyvalue} from "../../utils/otherservices";


//bulk upload users
export async function bulkuploadinventory(req:any, res:any){
    try{  
      const file = req.files.file;
      const filename= configuration.pharmacyuploadfilename;
      let allowedextension = ['.csv','.xlsx'];
      let uploadpath =`${process.cwd()}/${configuration.useruploaddirectory}`;
      var columnmapping={
        A: "servicecategory",
        B: "category",
        C: "servicetype",
        D: "lowstocklevel",
        E: "expirationdate",
        F: "lastrestockdate",
        G: "qty",
        H: "amount"
      };
    
    await uploaddocument(file,filename,allowedextension,uploadpath);
     //convert uploaded excel to json
     var convert_to_json = convertexceltojson(`${uploadpath}/${filename}${path.extname(file.name)}`, configuration.stocktemplate, columnmapping);
    console.log(convert_to_json);
     //save to database
    var {stocklist}:any = convert_to_json;
         if(stocklist.length > 0){
          for (var i = 0; i < stocklist.length; i++) {        
            const {servicecategory,category,servicetype,lowstocklevel,expirationdate,lastrestockdate,qty,amount} = stocklist[i];
            validateinputfaulsyvalue({servicecategory,category,servicetype,lowstocklevel,expirationdate,lastrestockdate,qty,amount});
            //ensure record does not exit
            
            const foundPrice =  await readoneprice({servicecategory,servicetype});
            if(foundPrice){
                throw new Error(`${servicetype} ${configuration.error.erroralreadyexit}`);
    
            }
            if(servicecategory !== configuration.category[1]){
              throw new Error(`${servicetype} ${configuration.error.erroralreadyexit}`);
  
          }
                
       
        }
        await createmanyprice(stocklist);
         }
        
        
         res.status(200).json({status: true, queryresult: 'Bulk upload was successfull'});
         
      }
      catch(e:any){
         //logger.error(e.message);
         res.status(403).json({status: false, msg:e.message});
  
      }
  }
  //get all stock

export async function getallpharmacystock(req:Request, res:any){
  try{
   
      const queryresult = await readallprices({servicecategory:configuration.category[1]});
      res.status(200).json({
          queryresult,
          status:true
        }); 

  }
  catch(e:any){
      res.status(403).json({status: false, msg:e.message});

  }

}
//add a stock
export var createstock = async (req:any,res:any) =>{
   
  try{
    req.body.servicecategory = configuration.category[1];
     const {servicecategory,amount,servicetype,category,qty,lowstocklevel,expirationdate,lastrestockdate} = req.body;
    //validations
    validateinputfaulsyvalue({servicecategory,category,servicetype,lowstocklevel,expirationdate,lastrestockdate,qty,amount});
    //ensure record does not exit
    
    const foundPrice =  await readoneprice({servicecategory,servicetype});
    if(foundPrice){
        throw new Error(`${servicetype} ${configuration.error.erroralreadyexit}`);

    }
    if(servicecategory !== configuration.category[1]){
      throw new Error(`${servicetype} ${configuration.error.erroralreadyexit}`);

  }
       const queryresult=await createprice({servicecategory,amount,servicetype,category,qty,lowstocklevel,expirationdate,lastrestockdate} );
      res.status(200).json({queryresult, status: true});
      

  }catch(error:any){
    console.log(error);
      res.status(403).json({ status: false, msg: error.message });
  }
}