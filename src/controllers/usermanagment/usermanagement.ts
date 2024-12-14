
import * as path from 'path';
import exeltojson from 'convert-excel-to-json';
import configuration from "../../config";
import  {readall,updateuser,readone}  from "../../dao/users";


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
//deactivate a user
export async function updatestatus(req:any, res:any){
    const {id} = req.params;
    try{
        const response = await readone({_id:id});
       const status= response?.status == configuration.userstatus[0]? configuration.userstatus[1]: configuration.userstatus[0];
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
  const fileName = file.name;
  const size = file.data.length/1024;
  const extension = path.extname(fileName);
  const renamedurl= `usersload${extension}`;
  let allowedextension = ['.csv','.xlsx'];
  if(!allowedextension.includes(extension))
  {
   throw new Error(configuration.error.errorfilextension);
  }
  if(size > configuration.allowedfilesize){
   throw new Error(configuration.error.errorfilelarge);
  }
 file.mv(`${process.cwd()}/uploads/${renamedurl}`,async (e:any)=>{
    if(e){
      //logger.error(e.message);
      throw new Error(configuration.error.errorfileupload);
    }
    else{
      let jsonresult = exeltojson({
        sourceFile: `${process.cwd()}/uploads/${renamedurl}`,
        sheets: [
            {
              // Excel Sheet Name
              name: configuration.shelftemplate,
    
              // Header Row -> be skipped and will not be present at our result object.
              header: {
                rows: 1,
              },
              // Mapping columns to keys
              columnToKey: {
                A: "productname",
                B: "store",
                C: "shelfid",
                D: "countedqty",
                E: "countedqtyserviceable",
                F: "countedqtyunserviceable",
               
              
              },
            },
          ],
       });

       var {shelftemplate} = jsonresult;
       /*
       for (var i = 0; i < shelftemplate.length; i++) {
        try{
        //validation
       var {shelfid,countedqty,countedqtyserviceable,countedqtyunserviceable} = shelftemplate[i];
       //validateinputfaulsyvalue
       validateinputfaulsyvalue({shelfid,countedqty,countedqtyserviceable,countedqtyunserviceable});
       //check for number
       validateinputfornumber({countedqty,countedqtyserviceable,countedqtyunserviceable});
        const queryshelf:any =await readoneproductshelfwithoutpopulatingcategory({_id:shelfid});
        //check for faulsy
        await createstock({store:queryshelf.store,productname:queryshelf.productname,qty:queryshelf.qty,qtyserviceable:queryshelf.qtyserviceable,qtyunserviceable:queryshelf.qtyunserviceable,shelfid,countedqty,countedqtyserviceable,countedqtyunserviceable,status: configuration.stockapprovals[6]});
    }
    catch(e:any){
        return res.json({status: false, msg:e.message});
        //break;
    }  
    }
    */
       //res.json({status: true, queryresult: 'Bulk upload was successfull'});
    }
    
  });
    }
    catch(e:any){
       //logger.error(e.message);
        res.json({status: false, msg:e.message});

    }
}
