import { AnyARecord } from "dns";
import { readwardaggregate, readclinicaggregate, readpaymentaggregate,readhmoaggregate } from "../../dao/reports";
import configuration from "../../config";
export const settings = async function () {
    try {
       
       
        //search pharmacy and spread the array
        const query = { type: configuration.clinictype[2] };

        
        //console.log(check2);
        const reports=[
            {querytype:"financialreport"},
            {querytype:"outpatient"},
            {querytype:"inpatient"},
            {querytype:"labreport"},
            {querytype:"procedurereport"},
            {querytype:"pharmacyreport"},
            {querytype:"radiologyreport"},

            
           // {querytype:"Nutrition",querygroup:[ "Number Of patient Deworked", "Number of Patient Growing Well"]},
          ];
        const summary=["financialaggregate","cashieraggregate","appointmentaggregate","admissionaggregate","procedureaggregate","clinicalaggregate","hmoaggregate","nutritionaggregate","health facility attendance","inpatient care","immunization(Antigen received)","Immunization (Adverse Events Following Immunization, AEFI)","Family Planning","Hospital Monthly Data"];
          return {reports,summary};
    }
    catch (error: any) {
        console.log("error", error);
       throw new Error(error.message);
    }

}


export async function settingsresponse(req:Request, res:any){
    try{
    //const {clinicdetails} = await readallclinics({},{"clinic":1, "id":1,"_id":0});
    //console.log("clinic", clinicdetails);
    var setting:any = await settings();
        res.status(200).json({
            querygroupsettings:setting.reports,
            status:true
          }); 

    }
    catch(e:any){
        res.json({status: false, msg:e.message});

    }

}
export async function settingsummaryresponse(req:Request, res:any){
    try{
    //const {clinicdetails} = await readallclinics({},{"clinic":1, "id":1,"_id":0});
    //console.log("clinic", clinicdetails);
    var setting:any = await settings();
        res.status(200).json({
            querygroupsettings:setting.summary,
            status:true
          }); 

    }
    catch(e:any){
        res.json({status: false, msg:e.message});

    }

}
export async function cashiersettings(req:any, res:any) {
    try{
        const cashieraggregatependingpaid = [
            {   
        
                $match:{cashieremail:{$ne:null}}    
        
        },
          
            {
              $group: {
                _id: "$cashieremail",                // Group by product
                
              }
            },
            {
              $project:{
                cashieremail:"$_id",
                _id:0
      
              }
      
            }
              
          ];
          readpaymentaggregate
          var queryresult:any = await readpaymentaggregate(cashieraggregatependingpaid);
          res.status(200).json({
            queryresult,
              status:true
            }); 


    }
    catch(e:any){
        res.json({status: false, msg:e.message});


    }

}
