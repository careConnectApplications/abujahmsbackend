import configuration from "../../config";
//downloadtemplete
export async function downloadtemplates(req:any, res:any){
   
         
           const downloadtemplatetypes = configuration.downloadtemplatetypes;
          
            //const fileName = req.params.type;
            //const fileName:any = downloadtemplatetypes.map(x => {if(x.type == req.params.type) return x.fileName});
            const fileName:any = downloadtemplatetypes.filter((x:any) => {if(x.type == req.params.type) return x.fileName});
            const filePath = `${process.cwd()}/${configuration.userdownloadsdirectory}/${fileName[0].fileName}`
          
            // Send the file as an attachment to trigger download
            res.download(filePath, fileName, (err:any) => {
              if (err) {
                console.log(err);
                
                return res.status(500).send(configuration.error.errordownload);
              }
            });
           
            
          

 
}