import path from "path";
import configuration from "../../config";
import  {readall,updateuser,readone,createuser}  from "../../dao/users";
import {createmanyprice,readoneprice,readallprices,createprice,updateprice} from "../../dao/price";
import {createmanyservicetype} from "../../dao/servicetype";;
import {uploaddocument,convertexceltojson,validateinputfaulsyvalue,generateRandomNumber} from "../../utils/otherservices";


//bulk upload users
export async function bulkuploadinventory(req:any, res:any){
    try{  
      const file = req.files.file;
      const filename= configuration.pharmacyuploadfilename;
      let allowedextension = ['.csv','.xlsx'];
      let uploadpath =`${process.cwd()}/${configuration.useruploaddirectory}`;
      var columnmapping={
      
        A: "category",
        B: "servicetype",
        C: "lowstocklevel",
        D: "expirationdate",
        E: "lastrestockdate",
        F: "qty",
        G: "amount"
      };
    
    await uploaddocument(file,filename,allowedextension,uploadpath);
     //convert uploaded excel to json
     var convert_to_json = convertexceltojson(`${uploadpath}/${filename}${path.extname(file.name)}`, configuration.stocktemplate, columnmapping);
    //console.log(convert_to_json);
   
     //save to database
    var {stocklist}:any = convert_to_json;

         if(stocklist.length > 0){
          var type:any = stocklist.map((services:any) => {return services.servicetype});
          for (var i = 0; i < stocklist.length; i++) {   
            stocklist[i].servicecategory=configuration.category[1];      
            var {servicecategory,category,servicetype,lowstocklevel,expirationdate,lastrestockdate,qty,amount} = stocklist[i];
            lowstocklevel = Number(lowstocklevel);
            qty=Number(qty);
            validateinputfaulsyvalue({servicecategory,category,servicetype,lowstocklevel,expirationdate,lastrestockdate,qty,amount});
            //ensure record does not exit
          var id = `${servicetype[0]}${generateRandomNumber(5)}${servicetype[servicetype.length -1]}`;    
        //await  Promise.all([createmanyprice({servicecategory,servicetype},{$set:{servicecategory,category,servicetype,lowstocklevel,expirationdate,lastrestockdate,qty,amount}}),
          //createmanyservicetype({ category:servicecategory,type: { $nin: [servicetype]} },
            //{$push: {type: servicetype},$set:{department:servicecategory,category:servicecategory,id}}
          //)]);

          await createmanyprice({servicecategory,servicetype},{$set:{servicecategory,category,servicetype,lowstocklevel,expirationdate,lastrestockdate,qty,amount}});
          await  createmanyservicetype({ category:servicecategory },
            {$push: {type: servicetype},$set:{department:servicecategory,category:servicecategory,id}}
          );
          //await  createmanyservicetype({ category:servicecategory,type: { $nin: [servicetype]} },
            //{$push: {type: servicetype},$set:{department:servicecategory,category:servicecategory,id}}
          //);
          

        }
        
       
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
    
       //const queryresult=await createprice({servicecategory,amount,servicetype,category,qty,lowstocklevel,expirationdate,lastrestockdate} );
       var id = `${servicetype[0]}${generateRandomNumber(5)}${servicetype[servicetype.length -1]}`;    
       const queryresult=await  Promise.all([
        createprice({servicecategory,amount,servicetype,category,qty,lowstocklevel,expirationdate,lastrestockdate} ),
         createmanyservicetype({ category:servicecategory,type: { $nin: [servicetype]} },
           {$push: {type: servicetype},$set:{department:servicecategory,category:servicecategory,id}}
         )
        ]);
       // create service type
       res.status(200).json({queryresult, status: true});
      

  }catch(error:any){
    console.log(error);
      res.status(403).json({ status: false, msg: error.message });
  }
}
//update stock
export async function updatestocks(req:any, res:any){
  try{
  //get id
  const {id} = req.params;
  req.body.servicecategory = configuration.category[1];
  const {servicecategory,amount,servicetype,category,qty,lowstocklevel,expirationdate,lastrestockdate} = req.body;
  //validations
  validateinputfaulsyvalue({servicecategory,category,servicetype,lowstocklevel,expirationdate,lastrestockdate,qty,amount});
  const foundPrice:any =  await readoneprice({_id:id});
  if(!foundPrice){
      throw new Error(`servicetype ${configuration.error.errornotfound}`);

  }
  if(foundPrice.servicecategory !== configuration.category[1]){
    throw new Error(`${foundPrice.servicecategory} ${configuration.error.erroralreadyexit}`);

}
  //var queryresult = await updateprice(id, req.body);
  var servicetypeid = `${servicetype[0]}${generateRandomNumber(5)}${servicetype[servicetype.length -1]}`;  
  const queryresult=await  Promise.all([
    updateprice(id,{servicecategory,amount,servicetype,category,qty,lowstocklevel,expirationdate,lastrestockdate} ),
     createmanyservicetype({ category:servicecategory,type: { $nin: [servicetype]} },
       {$push: {type: servicetype},$set:{department:servicecategory,category:servicecategory,id:servicetypeid}}
     )
    ]);
  res.status(200).json({
      queryresult,
      status:true
    }); 
  }catch(e:any){
    console.log(e);
    res.status(403).json({status: false, msg:e.message});

  }

}
//servicetype for pharmacy

