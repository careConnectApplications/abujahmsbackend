
import configuration from "../../config";
import { NextFunction, Request, Response } from "express";
import {readpaymentaggregate,readappointmentaggregate,readadmissionaggregate,readprocedureaggregate,readradiologyaggregate,readlabaggregate,readprescriptionaggregate,readpatientsmanagementaggregate,readnutritionaggregate,readimmunizationaggregate,readfamilyaggregate} from "../../dao/reports";
import {readallpayment}  from "../../dao/payment";
import {settings} from "../settings/settings";
import { financialreports } from "../../utils/reporting/financial";
import { cashieraggregatereports } from "../../utils/reporting/cashieraggregate";
import { appointmentaggregatereports } from "../../utils/reporting/appointmentaggregate";
import { admissionaggregatereports } from "../../utils/reporting/admission";
import { procedureaggregatereports } from "../../utils/reporting/procedure";
import { nutritionaggregatereports } from "../../utils/reporting/nutrition";
import { hmoaggregatereports } from "../../utils/reporting/hmo";
import {heathfacilityattendancereports} from "../../utils/reporting/healthfacilityattendance";
import {inpatientattendancereports} from "../../utils/reporting/inpatientcare";
import {immunizationaggregatereports} from "../../utils/reporting/immunization";
import {familyplanningreports} from "../../utils/reporting/familyplanning";
import { ApiError } from "../../errors";
import catchAsync from "../../utils/catchAsync";
export const reports = async (req:any, res:any) => {
try{

  //paymentcategory
  //cashieremail
var { querygroup, querytype, startdate, enddate }: any = req.params;
if (!querygroup) {
  throw new Error(`querygroup ${configuration.error.errorisrequired}`);
}

if (!startdate || !enddate) {
  var todaydate = new Date();
  enddate = todaydate;
  startdate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth() - 6,
    todaydate.getDate()
  );
} else {
  startdate = new Date(startdate);
  enddate = new Date(enddate);
}

const reportbyfinancialreport = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
    {   
            $match:{$and:[{paymentcategory: querygroup}, {createdAt:{ $gt: startdate, $lt: enddate }}]}   
    }
    
];



const reportbyadmissionreport = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
  {
    $lookup: {
      from: "wardmanagements",
      localField: "referedward",
      foreignField: "_id",
      as: "referedward",
    },
  },
  {
    $unwind: {
      path: "$referedward",
      preserveNullAndEmptyArrays: true
    }
    
  },
  {
    $match:{$and:[{"referedward.wardname": querygroup}, {referddate:{ $gt: startdate, $lt: enddate }}]} 
  },
];

const reportbyappointmentreport = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
  {
    $match:{$and:[{clinic: querygroup}, {
      appointmentdate:{ $gt: startdate, $lt: enddate }}]} 
  },
];

const reportbyhmoreport = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
  {
    $unwind: {
      path: "$patient",
      preserveNullAndEmptyArrays: true
    }
    
  },
  {
    $match:{$and:[{"patient.HMOName": querygroup}, {
      createdAt:{ $gt: startdate, $lt: enddate }}]} 
  },
];
const appointmentreportbyhmoreport = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
  {
    $unwind: {
      path: "$patient",
      preserveNullAndEmptyArrays: true
    }
    
  },
  {
    $match:{$and:[{"patient.HMOName": querygroup}, {
      appointmentdate:{ $gt: startdate, $lt: enddate }}]} 
  },
];
const secondaryservice = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
  {
    $unwind: {
      path: "$patient",
      preserveNullAndEmptyArrays: true
    }
    
  },
    {   
            $match:{$and:[{"patient.patienttype": configuration.patienttype[1]}, {createdAt:{ $gt: startdate, $lt: enddate }}]}   
    },
    {
      $addFields: {
        servicetype: {
          $ifNull: ["$testname", "$appointmenttype"]
        }
      }
    },
    {
      $project:{
        servicetype:1,
        patient:1

      }
    }
    
];
const proceduresecondaryservice = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
  {
    $unwind: {
      path: "$patient",
      preserveNullAndEmptyArrays: true
    }
    
  },
    {   
            $match:{$and:[{"patient.patienttype": configuration.patienttype[1]}, {createdAt:{ $gt: startdate, $lt: enddate }}]}   
    }
    ,
    {
      $addFields: {
        servicetype: {
          $reduce: {
            input: { $ifNull: ["$procedure", []] },
            initialValue: "",
            in: {
              $cond: {
                if: { $eq: ["$$value", ""] },
                then: "$$this",
                else: { $concat: ["$$value", ",", "$$this"] }
              }
            }
          }
        }
      }
    },
    {
      $project:{
        servicetype:1,
        patient:1

      }
    }
      
    
];

const patientsecondaryservice = [
 
    {   
            $match:{$and:[{patienttype: configuration.patienttype[1]}, {createdAt:{ $gt: startdate, $lt: enddate }}]}   
    }
    
];
const pharmacysecondaryservice = [
  {
    $lookup: {
      from: "patientsmanagements",
      localField: "patient",
      foreignField: "_id",
      as: "patient",
    },
  },
  {
    $unwind: {
      path: "$patient",
      preserveNullAndEmptyArrays: true
    }
    
  },
    {   
            $match:{$and:[{pharmacy: querygroup},{"patient.patienttype": configuration.patienttype[1]}, {createdAt:{ $gt: startdate, $lt: enddate }}]}   
    },
    {
      $addFields: {
        servicetype:"$prescription"
      }
    },
    {
      $project:{
        servicetype:1,
        patient:1

      }
    }
    
];


var queryresult: any;

//var c = await configuration.settings2();


let {reports}:any = await settings();
//Financial report
if (querytype == reports[0].querytype) {
  
  queryresult = await readpaymentaggregate(reportbyfinancialreport);
}  
else if(querytype == reports[1].querytype){
  queryresult= await readappointmentaggregate(reportbyappointmentreport);

}
else if(querytype == reports[2].querytype){
  queryresult= await readadmissionaggregate(reportbyadmissionreport);

}
else if(querytype == reports[3].querytype){
  queryresult= await readlabaggregate(reportbyhmoreport);

}
else if(querytype == reports[4].querytype){
  queryresult= await readprocedureaggregate(reportbyhmoreport);

}
else if(querytype == reports[5].querytype){
  queryresult= await readprescriptionaggregate(reportbyhmoreport);

}
else if(querytype == reports[6].querytype){
  queryresult= await readappointmentaggregate(appointmentreportbyhmoreport);

}
else if(querytype == reports[7].querytype){
  queryresult= await readradiologyaggregate(reportbyhmoreport);

}
else if(querytype == reports[8].querytype && querygroup ==reports[8].querygroup[0]){
  //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
  queryresult= await readappointmentaggregate(secondaryservice);

}
else if(querytype == reports[8].querytype && querygroup ==reports[8].querygroup[1]){
  //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
  queryresult= await readlabaggregate(secondaryservice);

}
/*
else if(querytype == reports[8].querytype && querygroup ==reports[8].querygroup[2]){
  //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
  queryresult= await readpatientsmanagementaggregate(patientsecondaryservice);

}
  */
else if(querytype == reports[8].querytype && querygroup ==reports[8].querygroup[2]){
  //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
  queryresult= await readradiologyaggregate(secondaryservice);

}
else if(querytype == reports[8].querytype && querygroup ==reports[8].querygroup[3]){
  //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
  queryresult= await readprocedureaggregate(proceduresecondaryservice);

}
else if(querytype == reports[8].querytype && querygroup ==reports[8].querygroup[4]){

  const [result1, result2, result3] = await Promise.all([
    readprocedureaggregate(proceduresecondaryservice),
    readradiologyaggregate(secondaryservice),
    readlabaggregate(secondaryservice),
    readappointmentaggregate(secondaryservice)
  ]);

  queryresult = [...result1, ...result2, ...result3];

  //queryresult= await readprocedureaggregate(proceduresecondaryservice);

}

else if(querytype == reports[8].querytype){
  //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
  queryresult= await readprescriptionaggregate(pharmacysecondaryservice);

}
else {
  throw new Error(`querytype ${configuration.error.errorisrequired}`);
}
res.json({ queryresult, status: true });


  }
  catch(e:any){
    console.log(e.message);
    res.json({status: false, msg:e.message});

  }

}
// cashier reconcillation
export const cashierreport = async (req:any, res:any) =>{
  try{

  //find cashier with status
   //paymentcategory
  //cashieremail
var {startdate, enddate, email }: any = req.params;
if (!startdate || !enddate) {
  var todaydate = new Date();
  enddate = todaydate;
  startdate = new Date(
    todaydate.getFullYear(),
    todaydate.getMonth(),
    todaydate.getDate()
  );
} else {
  startdate = new Date(startdate);
  enddate = new Date(enddate);
}

   
    var query ={cashieremail:email,createdAt:{ $gt: startdate, $lt: enddate }};
      var populatequery ='patient';
      const cashieraggregatependingpaid = [
        {   
        
          $match:{$and:[{status:configuration.status[3]},{cashieremail:email} , {createdAt:{ $gt: startdate, $lt: enddate }}]}   
  
  },
        {
          $group: {
            _id: "$cashieremail",                // Group by product
            totalAmount: { $sum: "$amount" },
            cashierid:{$first:"$cashierid"}
          }
        },
        {
          $project:{
            cashieremail:"$_id",
            totalAmount:1,
            cashierid:1,
            status:configuration.status[3],
            _id:0
  
          }
  
        }
          
      ];
      const queryresult = {paymentrecords: (await readallpayment(query,populatequery)).paymentdetails, paymentsummary:await readpaymentaggregate(cashieraggregatependingpaid)};
   
      res.json({
        queryresult,
        status: true,
      });


  //return total  
  }
  catch(e:any){
    res.json({status: false, msg:e.message});

  }

}
//report summary
export const reportsummary = catchAsync(async (req:Request,res:Response,next: NextFunction) =>{

    var  {querytype,startdate, enddate }:any = req.params;
    if (!startdate || !enddate) {
      var todaydate = new Date();
      enddate = todaydate;
      startdate = new Date(
        todaydate.getFullYear(),
        todaydate.getMonth(),
        todaydate.getDate()
      );
    } else {
      startdate = new Date(startdate);
      enddate = new Date(enddate);
    }
    
    let {summary}:any = await settings();
    const {financialaggregatepaid,financialaggregategrandtotalpaid} = financialreports(startdate,enddate)
    const {cashieraggregatepaid,cashieraggregatepaidgrandtotal} = cashieraggregatereports(startdate,enddate)
    const {appointmentaggregatescheduled,appointmentaggregatecomplete,appointmentaggregateinprogress,appointmentaggregatetotalnumberofappointments,clinicalaggregate} = appointmentaggregatereports(startdate,enddate)
    const {admissionaggregateadmited,admissionaggregatetransfered,admissionaggregatedischarged,admissionaggregatetotalnumberofadmissions} = admissionaggregatereports(startdate,enddate);
    const {procedureaggregatepaid,totalprocedureaggregate} = procedureaggregatereports(startdate, enddate);
    const {nutritionaggregatechildren12to59receiveddeworming,nutritionaggregatechildren0to59givenvitaminasupplement,nutritionaggregatechildren0to5exclusivebreadstfeeding,nutritionaggregatechildren0to59growingwell,nutritionaggregatechildren0to59thatreceivednutirtion} =nutritionaggregatereports(startdate, enddate);
    const {appointmentaggregatebyhmo,aggregatebyhmo} =hmoaggregatereports(startdate, enddate);
    const {heathfacilityoutpatientattendance,heathfacilitygeneralattendance} = heathfacilityattendancereports(startdate, enddate);
    const {inpatientdischarges} = inpatientattendancereports(startdate, enddate);
    const {immunizationpipeline,AEFIcasesreported} = immunizationaggregatereports(startdate, enddate);
    const {newfamilyplanningacceptorsByGender,counselCountByGender,moderncontraceptionbyagegroup,clientsgivenoralpills,totaloralpillcyclesdispensed,emergencyContraceptiveDispensed,injectablesByName,implantsInsertedByType,iudInserted,sterilizationByGender,maleCondomsDistributed,femaleCondomsDistributed,postpartumCounsellingCount,postPartumImplanonInsertions,postPartumJadelleInsertions,postPartumIUDInsertions}=familyplanningreports(startdate, enddate);
    let queryresult:any; 
    if(querytype == summary[0]){
     //queryresult = {paid: await readpaymentaggregate(financialaggregatepaid), pendingpayment:await readpaymentaggregate(financialaggregatependingpaid)};
     queryresult = {paid: await readpaymentaggregate(financialaggregatepaid), grandtotal: await readpaymentaggregate(financialaggregategrandtotalpaid)};
    }
    else if(querytype == summary[1]){
    //cashier summary
    queryresult = {paid: await readpaymentaggregate(cashieraggregatepaid), grandtotal:await readpaymentaggregate(cashieraggregatepaidgrandtotal)};
    }
    else if(querytype == summary[2]){
      queryresult = {scheduled: await readappointmentaggregate(appointmentaggregatescheduled),complete:await readappointmentaggregate(appointmentaggregatecomplete), inprogress:await readappointmentaggregate(appointmentaggregateinprogress), totalnumberofappointments: await readappointmentaggregate(appointmentaggregatetotalnumberofappointments)};
//appointmentaggregatetotalnumberofappointments
    //appointment summary
    }
    else if(querytype == summary[3]){
    //wardadmission summary
    queryresult= {admited: await readadmissionaggregate(admissionaggregateadmited),transfered:await readadmissionaggregate(admissionaggregatetransfered),discharged:await readadmissionaggregate(admissionaggregatedischarged), totalnumberofadmissions: await readadmissionaggregate(admissionaggregatetotalnumberofadmissions)};
    }
    else if(querytype == summary[4]){
      console.log("procedure");
      queryresult ={paid: await readprocedureaggregate(procedureaggregatepaid), grandtotal: await readprocedureaggregate(totalprocedureaggregate)}

    }
    else if(querytype == summary[5]){
      //clinicalaggregate
      queryresult = {clinicalreport: await readappointmentaggregate(clinicalaggregate)};

    }
    else if(querytype == summary[6]){
      queryresult = {
         hmolabsummary: await readlabaggregate(aggregatebyhmo),
         hmoproceduresummary: await readprocedureaggregate(aggregatebyhmo),
         hmopharmacysummary: await readprescriptionaggregate(aggregatebyhmo),
         hmoradiologysummary: await readradiologyaggregate(aggregatebyhmo),
         hmsappointmentsummary: await readappointmentaggregate(appointmentaggregatebyhmo)
        };

    }
    else if(querytype == summary[7]){
      
   const [children0to59thatreceivednutirtion,children0to59growingwell,children0to5exclusivebreadstfeeding,children0to59givenvitaminasupplement,children12to59receiveddeworming]  = await Promise.all([
    readnutritionaggregate(nutritionaggregatechildren0to59thatreceivednutirtion),
    readnutritionaggregate(nutritionaggregatechildren0to59growingwell),
    readnutritionaggregate(nutritionaggregatechildren0to5exclusivebreadstfeeding),
    readnutritionaggregate(nutritionaggregatechildren0to59givenvitaminasupplement),
    readnutritionaggregate(nutritionaggregatechildren12to59receiveddeworming)
   
  ]);
  queryresult = {children0to59thatreceivednutirtion,children0to59growingwell,children0to5exclusivebreadstfeeding,children0to59givenvitaminasupplement,children12to59receiveddeworming};
    }
      else if(querytype == summary[8]){
        const [outpatientattendance,generalattendance] = await Promise.all([readappointmentaggregate(heathfacilityoutpatientattendance),readappointmentaggregate(heathfacilitygeneralattendance)]);
        queryresult={outpatientattendance,generalattendance};

      }
      else if(querytype == summary[9]){
          queryresult = await readadmissionaggregate(inpatientdischarges);
      }
      else if(querytype == summary[10]){
        queryresult = await readimmunizationaggregate(immunizationpipeline);
      }
      else if(querytype == summary[11]){
        const [aeficasesreport]=await Promise.all([readimmunizationaggregate(AEFIcasesreported)]);
        queryresult = {aeficasesreport};
      }
      else if(querytype == summary[12]){
        const [newfamilyplanningacceptors,familyplanningclientscounselled,femalesusingmoderncontraception,clientsgivenoralpill,oralpillcyclesdispensed,emergencycontraceptivedispense,injectablesgiven,Implantsinserted,iudInserteds,sterilization,malecondomdistributed,femalecondomdistributed,womencounselledonpostpartumfamilyplanning,postpartumimplanoninserted,postpartumjadelleinserted,postpartumIUDinserted]=await Promise.all([readfamilyaggregate(newfamilyplanningacceptorsByGender),readfamilyaggregate(counselCountByGender),readfamilyaggregate(moderncontraceptionbyagegroup),readfamilyaggregate(clientsgivenoralpills),readfamilyaggregate(totaloralpillcyclesdispensed),readfamilyaggregate(emergencyContraceptiveDispensed),readfamilyaggregate(injectablesByName),readfamilyaggregate(implantsInsertedByType),readfamilyaggregate(iudInserted),readfamilyaggregate(sterilizationByGender),readfamilyaggregate(maleCondomsDistributed),readfamilyaggregate(femaleCondomsDistributed),readfamilyaggregate(postpartumCounsellingCount),readfamilyaggregate(postPartumImplanonInsertions),readfamilyaggregate(postPartumJadelleInsertions),readfamilyaggregate(postPartumIUDInsertions)]);
       queryresult={newfamilyplanningacceptors,familyplanningclientscounselled,femalesusingmoderncontraception,clientsgivenoralpill,oralpillcyclesdispensed,emergencycontraceptivedispense,injectablesgiven,Implantsinserted,iudInserteds,sterilization,malecondomdistributed,femalecondomdistributed,womencounselledonpostpartumfamilyplanning,postpartumimplanoninserted,postpartumjadelleinserted,postpartumIUDinserted};
      }
    else{
      return next(new ApiError(400,`querytype ${configuration.error.errorisrequired}`))
    }
    

    res.json({ queryresult, status: true });
    


  
 
})


//add pharmacy 1 , pharmacy 2
//add agggreate appointbyicnd10