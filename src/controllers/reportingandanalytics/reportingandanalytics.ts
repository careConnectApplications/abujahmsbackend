
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
import {mergeCounts,formatRow,reportbyappointmentreport,reportbyadmissionreport,reportbyfinancialreport,reportlab,appointmentreportbyhmoreport,secondaryservice,reportprocedure,pharmacysecondaryservice} from "./reportingandanalytics.helper";
import { ApiError } from "../../errors";
import catchAsync from "../../utils/catchAsync";
export const reports = async (req:any, res:any) => {
try{
  const {filters} = req.body;
  //paymentcategory
  //cashieremail
var { querytype}: any = req.params;
var queryresult: any;

//var c = await configuration.settings2();


let {reports}:any = await settings();
//Financial report
if (querytype == reports[0].querytype) {
  
  queryresult = await readpaymentaggregate(reportbyfinancialreport(filters));
}  
else if(querytype == reports[1].querytype){
  queryresult= await readappointmentaggregate(reportbyappointmentreport(filters));

}
else if(querytype == reports[2].querytype){
  queryresult= await readadmissionaggregate(reportbyadmissionreport(filters));

}
else if(querytype == reports[3].querytype){
  queryresult= await readlabaggregate(reportlab(filters));

}
else if(querytype == reports[4].querytype){
  queryresult= await readprocedureaggregate(reportprocedure(filters));

}
else if(querytype == reports[5].querytype){
  queryresult= await readprescriptionaggregate(reportlab(filters));

}
else if(querytype == reports[6].querytype){
  queryresult= await readappointmentaggregate(appointmentreportbyhmoreport(filters));

}
else if(querytype == reports[7].querytype){
  queryresult= await readradiologyaggregate(reportlab(filters));

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
    
    const {financialaggregatepaid,financialaggregategrandtotalpaid} = financialreports(startdate,enddate);
    const {cashieraggregatepaid,cashieraggregatepaidgrandtotal} = cashieraggregatereports(startdate,enddate);
    const {appointmentaggregatescheduled,appointmentaggregatecomplete,appointmentaggregateinprogress,appointmentaggregatetotalnumberofappointments,clinicalaggregate,outpatientdepartmentpipeline, accidentEmergencyRecordsPipeline} = appointmentaggregatereports(startdate,enddate)
    const {admissionaggregateadmited,admissionaggregatetransfered,admissionaggregatedischarged,admissionaggregatetotalnumberofadmissions,inpatientrecordspipeline} = admissionaggregatereports(startdate,enddate);
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
       else if(querytype == summary[13]){
      const outpatientdepartmentreport = await readappointmentaggregate(outpatientdepartmentpipeline);
      const InpatientRecordsreport = await readadmissionaggregate(inpatientrecordspipeline);
      const accidentEmergencyRecordsReport = await readappointmentaggregate(accidentEmergencyRecordsPipeline);
      queryresult = {
      accidentEmergencyRecords:{
          "Accident & Emergency Attendance": formatRow(accidentEmergencyRecordsReport[0].accidentAndEmergencyAttendance),
          "Road Traffic Accident (RTA)": formatRow(accidentEmergencyRecordsReport[0].roadTrafficAccident),
          "EPU Attendance": formatRow(accidentEmergencyRecordsReport[0].epuAttendance),
          //"Dressing": formatRow(accidentEmergencyRecordsReport[0].dressing),
          "A & E Death": formatRow(accidentEmergencyRecordsReport[0].aAndEDeath),
          "EPU Death": formatRow(accidentEmergencyRecordsReport[0].epuDeath),
          "Brought in Death (BID)": formatRow(accidentEmergencyRecordsReport[0].broughtInDeath),
          "BID in EPU": formatRow(accidentEmergencyRecordsReport[0].bidInEpu),
          "Outpatients Referred In": formatRow(accidentEmergencyRecordsReport[0].outpatientsReferredIn),
          "Outpatients Referred Out": formatRow(accidentEmergencyRecordsReport[0].outpatientsReferredOut)
      },
      outpatientDepartment:{  
      "New Registration Adult": formatRow(outpatientdepartmentreport[0].newAdult),
      "New Registration Paediatrics": formatRow(outpatientdepartmentreport[0].newPaediatrics),
      "Family Medicine Attendance": formatRow(outpatientdepartmentreport[0].familyMedicine),
      "POPD Attendance": formatRow(outpatientdepartmentreport[0].popd)
          },
      InpatientRecords:{
      broughtForward: formatRow(InpatientRecordsreport[0].broughtForward),
      newAdmission: formatRow(InpatientRecordsreport[0].newAdmission),
      totalAdmission:formatRow( mergeCounts(
        InpatientRecordsreport[0].broughtForward,
        InpatientRecordsreport[0].newAdmission
      )),
      discharges:formatRow( InpatientRecordsreport[0].discharges),
      deaths:formatRow(InpatientRecordsreport[0].deaths),
      referredIn: formatRow(InpatientRecordsreport[0].referredIn),
      referredOut: formatRow(InpatientRecordsreport[0].referredOut)
    }
    };
       }
     
    else{
      return next(new ApiError(400,`querytype ${configuration.error.errorisrequired}`))
    }
  //}

    

    res.json({ queryresult, status: true });
    


  
 
})


/////////////////reports for
