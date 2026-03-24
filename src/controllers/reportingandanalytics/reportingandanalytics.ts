
import configuration from "../../config";
import { NextFunction, Request, Response } from "express";
<<<<<<< HEAD
import {readpaymentaggregate,readappointmentaggregate,readadmissionaggregate,readprocedureaggregate,readradiologyaggregate,readlabaggregate,readprescriptionaggregate,readpatientsmanagementaggregate,readnutritionaggregate,readimmunizationaggregate,readfamilyaggregate,readthirdstageLabouraggregate,readsecondstageLabouraggregate,readfirststageLabouraggregate,readmortalityregisteraggregate,readbirthregisteraggregate,readeyeconditionaggregate} from "../../dao/reports";
=======
import {readpaymentaggregate,readappointmentaggregate,readadmissionaggregate,readprocedureaggregate,readradiologyaggregate,readlabaggregate,readprescriptionaggregate,readpatientsmanagementaggregate,readnutritionaggregate,readimmunizationaggregate,readfamilyaggregate} from "../../dao/reports";
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
import {labinvestigationreports} from "../../utils/reporting/labinvestigation";
import {radiodiagnosisreports} from "../../utils/reporting/radiodiagnosis";
import {operationreports} from "../../utils/reporting/operation";
import {specialconsultativereports} from "../../utils/reporting/specialconsultative";
import {maternityreports} from "../../utils/reporting/maternity";
import {mortalityreports} from "../../utils/reporting/mortality";
import {eyeConditionReports} from "../../utils/reporting/eyecondition";
import {diseaseCasesReports} from "../../utils/reporting/diseasecases";
import {removeEmptyStrings,mergeCounts,formatRow,formatEyeConditionReport,formatDiseaseCasesReport,reportbyappointmentreport,reportbyadmissionreport,reportbyfinancialreport,reportlab,reportprocedure,reportpharmacy,reportradiology,reportimmunization,reportdeath} from "./reportingandanalytics.helper";
import { ApiError } from "../../errors";
import catchAsync from "../../utils/catchAsync";

// Utility function to remove empty string values from an object


=======
import { ApiError } from "../../errors";
import catchAsync from "../../utils/catchAsync";
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
export const reports = async (req:any, res:any) => {
try{
  let {filters} = req.body;
  // Remove empty string values from filters
  filters = removeEmptyStrings(filters);
  console.log("filter", filters);
  
  //paymentcategory
  //cashieremail
<<<<<<< HEAD
var { querytype}: any = req.params;
=======
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
            $match:{$and:[{paymentcategory: querygroup}, {updatedAt:{ $gt: startdate, $lt: enddate }}]}   
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


>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
  queryresult= await readprescriptionaggregate(reportpharmacy(filters));

}

else if(querytype == reports[6].querytype){
  queryresult= await readradiologyaggregate(reportradiology(filters));

}
else if(querytype == reports[7].querytype){
  queryresult= await readimmunizationaggregate(reportimmunization(filters));

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
  queryresult= await readappointmentaggregate(reportdeath(filters));

}
else {
  throw new Error(`Query type ${configuration.error.errorisrequired}`);
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
    todaydate.getMonth() - 6,
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
        todaydate.getMonth() - 6,
        todaydate.getDate()
      );
    } else {
      startdate = new Date(startdate);
      enddate = new Date(enddate);
    }
     
    let {summary}:any = await settings();
<<<<<<< HEAD
    const {financialaggregatepaid,financialaggregategrandtotalpaid} = financialreports(startdate,enddate);
    const {cashieraggregatepaid,cashieraggregatepaidgrandtotal} = cashieraggregatereports(startdate,enddate);
    const {appointmentaggregatescheduled,appointmentaggregatecomplete,appointmentaggregateinprogress,appointmentaggregatetotalnumberofappointments,clinicalaggregate,outpatientdepartmentpipeline, accidentEmergencyRecordsPipeline} = appointmentaggregatereports(startdate,enddate)
    const {admissionaggregateadmited,admissionaggregatetransfered,admissionaggregatedischarged,admissionaggregatetotalnumberofadmissions,inpatientrecordspipeline} = admissionaggregatereports(startdate,enddate);
    const {procedureaggregatepaid,totalprocedureaggregate} = procedureaggregatereports(startdate, enddate);
    const {nutritionaggregatechildren12to59receiveddeworming,nutritionaggregatechildren0to59givenvitaminasupplement,nutritionaggregatechildren0to5exclusivebreadstfeeding,nutritionaggregatechildren0to59growingwell,nutritionaggregatechildren0to59thatreceivednutirtion} =nutritionaggregatereports(startdate, enddate);
    const {appointmentaggregatebyhmo,aggregatebyhmo,insurancePatientsByGenderAndName} =hmoaggregatereports(startdate, enddate);
    const {heathfacilityoutpatientattendance,heathfacilitygeneralattendance} = heathfacilityattendancereports(startdate, enddate);
    const {inpatientdischarges} = inpatientattendancereports(startdate, enddate);
    const {immunizationpipeline,AEFIcasesreported,immunizationByGenderAndVaccination} = immunizationaggregatereports(startdate, enddate);
    const {newfamilyplanningacceptorsByGender,counselCountByGender,moderncontraceptionbyagegroup,clientsgivenoralpills,totaloralpillcyclesdispensed,emergencyContraceptiveDispensed,injectablesByName,implantsInsertedByType,iudInserted,sterilizationByGender,maleCondomsDistributed,femaleCondomsDistributed,postpartumCounsellingCount,postPartumImplanonInsertions,postPartumJadelleInsertions,postPartumIUDInsertions}=familyplanningreports(startdate, enddate);
    const {labInvestigationPipeline} = labinvestigationreports(startdate, enddate);
    const {radioDiagnosisPipeline} = radiodiagnosisreports(startdate, enddate);
    const {operationPipeline} = operationreports(startdate, enddate);
    const {specialConsultativePipeline} = specialconsultativereports(startdate, enddate);
    const {
      liveBirthPipeline,
      freshStillBirthPipeline,
      maceratedStillBirthPipeline,
      asphyxiaPipeline,
      lowBirthWeightPipeline,
      macrosomicBabiesPipeline,
      earlyNeoNatalDeathPipeline,
      bornBeforeArrivalPipeline,
      preMaturityPipeline,
      neoNatalDeathPipeline,
      bookedCasesPipeline,
      unbookedCasesPipeline,
      svdPipeline,
      vacuumDeliveryPipeline,
      forcepsDeliveryPipeline,
      electiveCaesareanPipeline,
      emergencyCaesareanPipeline,
      svdFromSecondStagePipeline,
      csFromSecondStagePipeline,
      twinDeliveryPipeline,
      tripletDeliveryPipeline,
      quadrupletDeliveryPipeline,
      breechPresentationPipeline,
      inductionOfLabourPipeline,
      pretermLabourPipeline,
      manualRemovalOfPlacentaPipeline,
      postPartumHemorrhagePipeline,
      prematureRuptureOfMembranePipeline,
      antePartumHemorrhagePipeline,
      placentaPreviaPipeline,
      abruptioPlacentaPipeline,
      preEclampsiaPipeline,
      eclampsiaPipeline,
      maternalDeathPipeline,
      maternalDeathFromMortalityPipeline,
      pregnancyInducedHypertensionPipeline,
      mvaPipeline,
      missedAbortionPipeline,
      inducedAbortionPipeline,
      criminalAbortionPipeline,
      newFistulaCasesPipeline,
      admittedFistulaCasesPipeline,
      firstRepairPipeline,
      secondRepairPipeline,
      surgeryForFistulaRepairPipeline,
      dischargesAfterFistulaSurgeryPipeline,
      closedAndDryFistulaAtDischargePipeline,
      liveBirthsLowWeightPipeline,
      liveBirthsNormalWeightPipeline,
      freshStillBirthsCountPipeline,
      maceratedStillBirthsCountPipeline,
      childrenUnder1YearRegisteredPipeline,
      birthCertificatesIssuedPipeline,
      birthCertificatesCollectedPipeline
    } = maternityreports(startdate, enddate);
    
    const {
      mortality0to28DaysPipeline,
      mortality29Daysto11MonthsPipeline,
      mortality12to59MonthsPipeline,
      mortality5to9YearsPipeline,
      mortality10to19YearsPipeline,
      mortality20PlusYearsPipeline,
      maternalMortalityUnder20Pipeline,
      maternalMortality20to34Pipeline,
      maternalMortality35PlusPipeline,
      neonatalDeathPrematurityPipeline,
      neonatalDeathTetanusPipeline,
      neonatalDeathMalformationPipeline,
      neonatalDeathOtherPipeline,
      underFiveDeathMalariaPipeline,
      underFiveDeathPneumoniaPipeline,
      underFiveDeathMalnutritionPipeline,
      underFiveDeathOtherPipeline
    } = mortalityreports(startdate, enddate);
  
    let queryresult:any;
=======
    
    const {financialaggregatepaid,financialaggregategrandtotalpaid} = financialreports(startdate,enddate);
    const {cashieraggregatepaid,cashieraggregatepaidgrandtotal} = cashieraggregatereports(startdate,enddate);
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
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
   
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
<<<<<<< HEAD
=======
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
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
     
      const InpatientRecordsreport = await readadmissionaggregate(inpatientrecordspipeline);
            queryresult = {   
   
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
    };
       }
    else if (querytype == summary[14]){
       const outpatientdepartmentreport = await readappointmentaggregate(outpatientdepartmentpipeline);
       queryresult={
        "New Registration Adult": formatRow(outpatientdepartmentreport[0].newAdult),
      "New Registration Paediatrics": formatRow(outpatientdepartmentreport[0].newPaediatrics),
      "Family Medicine Attendance": formatRow(outpatientdepartmentreport[0].familyMedicine),
      "POPD Attendance": formatRow(outpatientdepartmentreport[0].popd)
       }
    }
    else if(querytype == summary[15]){
      const accidentEmergencyRecordsReport = await readappointmentaggregate(accidentEmergencyRecordsPipeline);
      queryresult={
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
      }

    }
    else if(querytype == summary[16]){
      queryresult=await readpatientsmanagementaggregate(insurancePatientsByGenderAndName);
    }
    else if(querytype == summary[17]){
      // Lab Investigation Report - Section F
      const labReport = await readlabaggregate(labInvestigationPipeline);
     
        queryresult = {
        "Haematology": formatRow(labReport[0]?.hematology || []),
        "Parasitology": formatRow(labReport[0]?.parasitology || []),
        "Chemistry": formatRow(labReport[0]?.chemicalpathology || []),
        "Microbiology": formatRow(labReport[0]?.microbiology || []),
        "Blood Transfusion": formatRow(labReport[0]?.bloodtransfusion || []),
        "Blood Donation": formatRow(labReport[0]?.blooddonation || []),
        "Histology": formatRow(labReport[0]?.histology || []),
        "Histopathology (Autopsy)": formatRow(labReport[0]?.histopathologyAutopsy || []),
        "Cytology": formatRow(labReport[0]?.cytology || [])
      };
      
    }
    else if(querytype == summary[18]){
      // Radio Diagnosis Report - Section G (Simplified by testname and gender)
      const radioReport = await readradiologyaggregate(radioDiagnosisPipeline);
      // Group the flat results by testname for easier processing
      const groupedByTest: any = {};
      radioReport.forEach((item: any) => {
        if (!groupedByTest[item.testname]) {
          groupedByTest[item.testname] = [];
        }
        groupedByTest[item.testname].push({
          _id: item.gender,
          count: item.count
        });
      });
      
      // Format each test's results
      queryresult = {};
      Object.keys(groupedByTest).forEach(testname => {
        queryresult[testname] = formatRow(groupedByTest[testname]);
      });
    }
    else if(querytype == summary[19]){
      // Operation Report - Section H
      const operationReport = await readprocedureaggregate(operationPipeline);
      queryresult = {
        "Major Operation": formatRow(operationReport[0]?.majorOperation || []),
        "Intermediate Operation": formatRow(operationReport[0]?.intermediateOperation || []),
        "Minor Operation": formatRow(operationReport[0]?.minorOperation || []),
        "Circumcision": formatRow(operationReport[0]?.circumcision || [])
      };
    }
    else if(querytype == summary[20]){
      // Special Consultative Report - Section I
      const specialReport:any = await readappointmentaggregate(specialConsultativePipeline);
      
      
      // Process appointmentsByClinic data - grouped by clinic and gender
      const clinicData: any = {};
      if (specialReport[0]?.appointmentsByClinic) {
        specialReport[0].appointmentsByClinic.forEach((item: any) => {
          const clinicName = item._id?.clinic;
          if (clinicName) {
            if (!clinicData[clinicName]) {
              clinicData[clinicName] = [];
            }
            clinicData[clinicName].push({
              _id: item._id?.gender,
              count: item.count
            });
          }
        });
      }
      
      // Format each clinic's results
      queryresult = {};
      
      // Add all regular appointments grouped by clinic
      Object.keys(clinicData).forEach(clinicName => {
        queryresult[clinicName] = formatRow(clinicData[clinicName]);
      });
      
      // Add special data sources
      queryresult["Ante-Natal Registration (New)"] = formatRow(specialReport[0]?.antenatalRegistrationNew || []);
      queryresult["Ante-Natal Follow up"] = formatRow(specialReport[0]?.antenatalFollowUp || []);
      queryresult["Dental Clinic"] = formatRow(specialReport[0]?.dentalClinic || []);
      queryresult["Family Planning Attendance (New)"] = formatRow(specialReport[0]?.familyPlanningNew || []);
      queryresult["Family Planning Attendance (Follow-up)"] = formatRow(specialReport[0]?.familyPlanningFollowUp || []);
    }
    
    
    else if(querytype == summary[21]){
      // Immunization Report - Grouped by Gender and Vaccination
      const immunizationReport = await readimmunizationaggregate(immunizationByGenderAndVaccination);
      
      // Group the flat results by vaccination for easier processing
      const groupedByVaccination: any = {};
      immunizationReport.forEach((item: any) => {
        if (!groupedByVaccination[item.vaccination]) {
          groupedByVaccination[item.vaccination] = [];
        }
        groupedByVaccination[item.vaccination].push({
          _id: item.gender,
          count: item.count
        });
      });
      
      // Format each vaccination's results
      queryresult = {};
      Object.keys(groupedByVaccination).forEach(vaccination => {
        queryresult[vaccination] = formatRow(groupedByVaccination[vaccination]);
      });
    }
    else if(querytype == summary[22]){
      // MATERNITY RETURN Report
      const [
        // Babies Data
        liveBirth,
        freshStillBirth,
        maceratedStillBirth,
        asphyxia,
        lowBirthWeight,
        macrosomicBabies,
        earlyNeoNatalDeath,
        bornBeforeArrival,
        preMaturity,
        neoNatalDeath,
        // Mothers Data - Booking Status  
        bookedCases,
        unbookedCases,
        // Type of Delivery
        svd,
        vacuumDelivery,
        forcepsDelivery,
        electiveCaesarean,
        emergencyCaesarean,
        // Also check SecondStageLabour
        svdFromSecondStage,
        csFromSecondStage,
        // Multiple Gestation
        twinDelivery,
        tripletDelivery,
        quadrupletDelivery,
        // Obstetric Complications
        breechPresentation,
        inductionOfLabour,
        inductionFromFirstStage,
        pretermLabour,
        manualRemovalOfPlacenta,
        postPartumHemorrhage,
        prematureRuptureOfMembrane,
        antePartumHemorrhage,
        placentaPrevia,
        abruptioPlacenta,
        preEclampsia,
        eclampsia,
        maternalDeath,
        maternalDeathFromMortality,
        pregnancyInducedHypertension,
        mva,
        missedAbortion,
        inducedAbortion,
        criminalAbortion,
        // Obstetric Fistula Services
        newFistulaCases,
        admittedFistulaCases,
        firstRepair,
        secondRepair,
        surgeryForFistulaRepair,
        dischargesAfterFistulaSurgery,
        closedAndDryFistulaAtDischarge
      ] = await Promise.all([
        // Babies Data
        readthirdstageLabouraggregate(liveBirthPipeline),
        readthirdstageLabouraggregate(freshStillBirthPipeline),
        readthirdstageLabouraggregate(maceratedStillBirthPipeline),
        readthirdstageLabouraggregate(asphyxiaPipeline),
        readthirdstageLabouraggregate(lowBirthWeightPipeline),
        readthirdstageLabouraggregate(macrosomicBabiesPipeline),
        readthirdstageLabouraggregate(earlyNeoNatalDeathPipeline),
        readthirdstageLabouraggregate(bornBeforeArrivalPipeline),
        readthirdstageLabouraggregate(preMaturityPipeline),
        readmortalityregisteraggregate(neoNatalDeathPipeline),
        // Mothers Data
        readthirdstageLabouraggregate(bookedCasesPipeline),
        readthirdstageLabouraggregate(unbookedCasesPipeline),
        // Type of Delivery
        readthirdstageLabouraggregate(svdPipeline),
        readthirdstageLabouraggregate(vacuumDeliveryPipeline),
        readthirdstageLabouraggregate(forcepsDeliveryPipeline),
        readthirdstageLabouraggregate(electiveCaesareanPipeline),
        readthirdstageLabouraggregate(emergencyCaesareanPipeline),
        // Check SecondStageLabour as well
        readsecondstageLabouraggregate(svdFromSecondStagePipeline),
        readsecondstageLabouraggregate(csFromSecondStagePipeline),
        // Multiple Gestation
        readthirdstageLabouraggregate(twinDeliveryPipeline),
        readthirdstageLabouraggregate(tripletDeliveryPipeline),
        readthirdstageLabouraggregate(quadrupletDeliveryPipeline),
        // Obstetric Complications
        readthirdstageLabouraggregate(breechPresentationPipeline),
        readthirdstageLabouraggregate(inductionOfLabourPipeline),
        readfirststageLabouraggregate(inductionOfLabourPipeline), // Also check FirstStageLabour
        readthirdstageLabouraggregate(pretermLabourPipeline),
        readthirdstageLabouraggregate(manualRemovalOfPlacentaPipeline),
        readthirdstageLabouraggregate(postPartumHemorrhagePipeline),
        readthirdstageLabouraggregate(prematureRuptureOfMembranePipeline),
        readthirdstageLabouraggregate(antePartumHemorrhagePipeline),
        readthirdstageLabouraggregate(placentaPreviaPipeline),
        readthirdstageLabouraggregate(abruptioPlacentaPipeline),
        readthirdstageLabouraggregate(preEclampsiaPipeline),
        readthirdstageLabouraggregate(eclampsiaPipeline),
        readthirdstageLabouraggregate(maternalDeathPipeline),
        readmortalityregisteraggregate(maternalDeathFromMortalityPipeline),
        readthirdstageLabouraggregate(pregnancyInducedHypertensionPipeline),
        readthirdstageLabouraggregate(mvaPipeline),
        readthirdstageLabouraggregate(missedAbortionPipeline),
        readthirdstageLabouraggregate(inducedAbortionPipeline),
        readthirdstageLabouraggregate(criminalAbortionPipeline),
        // Obstetric Fistula Services
        readthirdstageLabouraggregate(newFistulaCasesPipeline),
        readthirdstageLabouraggregate(admittedFistulaCasesPipeline),
        readthirdstageLabouraggregate(firstRepairPipeline),
        readthirdstageLabouraggregate(secondRepairPipeline),
        readthirdstageLabouraggregate(surgeryForFistulaRepairPipeline),
        readthirdstageLabouraggregate(dischargesAfterFistulaSurgeryPipeline),
        readthirdstageLabouraggregate(closedAndDryFistulaAtDischargePipeline)
      ]);
      console.log("liveBirt",liveBirth);
      // Helper function to format female-only data
      const formatFemaleOnly = (data: any[]) => {
        const count = data[0]?.count || 0;
        return { female: count, total: count };
      };

      // Combine SVD from both sources
      const totalSVD = (svd[0]?.count || 0) + (svdFromSecondStage[0]?.count || 0);
      const totalCS = (electiveCaesarean[0]?.count || 0) + (emergencyCaesarean[0]?.count || 0) + (csFromSecondStage[0]?.count || 0);
      
      // Combine induction of labour from both sources
      const totalInductionOfLabour = (inductionOfLabour[0]?.count || 0) + (inductionFromFirstStage[0]?.count || 0);
      
      // Combine maternal death from both sources
      const totalMaternalDeath = (maternalDeath[0]?.count || 0) + (maternalDeathFromMortality[0]?.count || 0);
      
      // Calculate composite metrics
      const iufdCount = (freshStillBirth[0]?.count || 0) + (maceratedStillBirth[0]?.count || 0);
      const perinatalDeathCount = iufdCount + (earlyNeoNatalDeath[0]?.count || 0);
      const totalVaginalDeliveries = totalSVD + (vacuumDelivery[0]?.count || 0) + (forcepsDelivery[0]?.count || 0);
      const totalCaesareanSections = totalCS;
      const totalBirths = liveBirth.reduce((sum: number, item: any) => sum + (item.count || 0), 0) + iufdCount;
      const totalDeliveries = totalVaginalDeliveries + totalCaesareanSections;

      queryresult = {
        // BABIES DATA
        "Live Birth": formatRow(liveBirth),
        "Fresh Still Birth": formatRow(freshStillBirth),
        "Macerated Still Birth": formatRow(maceratedStillBirth),
        "Asphyxia": formatRow(asphyxia),
        "Low Birth Weight (<2.5kg)": formatRow(lowBirthWeight),
        "Macrosomic Babies (≥4.5kg)": formatRow(macrosomicBabies),
        "Early Neo Natal Death (death within 7 days of Age)": formatRow(earlyNeoNatalDeath),
        "Born Before Arrival": formatRow(bornBeforeArrival),
        "Pre-Maturity (<34 Weeks)": formatRow(preMaturity),
        "IUFD (Intra Uterine Fetal Death)": { 
          male: (freshStillBirth.find((r: any) => r._id?.toLowerCase() === "male")?.count || 0) + 
                (maceratedStillBirth.find((r: any) => r._id?.toLowerCase() === "male")?.count || 0),
          female: (freshStillBirth.find((r: any) => r._id?.toLowerCase() === "female")?.count || 0) + 
                  (maceratedStillBirth.find((r: any) => r._id?.toLowerCase() === "female")?.count || 0),
          total: iufdCount 
        },
        "Perinatal Death (IUFD + Baby Deaths within 7 Days)": { 
          male: (freshStillBirth.find((r: any) => r._id?.toLowerCase() === "male")?.count || 0) + 
                (maceratedStillBirth.find((r: any) => r._id?.toLowerCase() === "male")?.count || 0) +
                (earlyNeoNatalDeath.find((r: any) => r._id?.toLowerCase() === "male")?.count || 0),
          female: (freshStillBirth.find((r: any) => r._id?.toLowerCase() === "female")?.count || 0) + 
                  (maceratedStillBirth.find((r: any) => r._id?.toLowerCase() === "female")?.count || 0) +
                  (earlyNeoNatalDeath.find((r: any) => r._id?.toLowerCase() === "female")?.count || 0),
          total: perinatalDeathCount
        },
        "Neo-natal death (Death within 28 days of Age)": formatRow(neoNatalDeath),
        
        // MOTHERS DATA - BOOKING STATUS
        "Booked Cases": formatFemaleOnly(bookedCases),
        "Unbooked Cases": formatFemaleOnly(unbookedCases),
        
        // TYPE OF DELIVERY
        "SVD": formatFemaleOnly([{ count: totalSVD }]),
        "Vacuum Delivery": formatFemaleOnly(vacuumDelivery),
        "Forceps Delivery": formatFemaleOnly(forcepsDelivery),
        "Total No of Vaginal Deliveries (VD)": { female: totalVaginalDeliveries, total: totalVaginalDeliveries },
        "Elective Caesarean Section": formatFemaleOnly(electiveCaesarean),
        "Emergency Caesarean Section": formatFemaleOnly([{ count: (emergencyCaesarean[0]?.count || 0) + (csFromSecondStage[0]?.count || 0) }]),
        "Total No of Caesarean Section Deliveries": { female: totalCaesareanSections, total: totalCaesareanSections },
        
        // MULTIPLE GESTATION
        "Multiple Gestation": formatFemaleOnly([{ count: (twinDelivery[0]?.count || 0) + (tripletDelivery[0]?.count || 0) + (quadrupletDelivery[0]?.count || 0) }]),
        "Twin Delivery": formatFemaleOnly(twinDelivery),
        "Triplet Delivery": formatFemaleOnly(tripletDelivery),
        "Quadruplet Delivery": formatFemaleOnly(quadrupletDelivery),
        "Total Births (Live Births + IUFD)": { male: 0, female: 0, total: totalBirths },
        "Total Deliveries (Vaginal + C/S)": { female: totalDeliveries, total: totalDeliveries },
        
        // OBSTETRIC COMPLICATIONS
        "Breech Presentation": formatFemaleOnly(breechPresentation),
        "Induction of Labour": formatFemaleOnly([{ count: totalInductionOfLabour }]),
        "Preterm Labour": formatFemaleOnly(pretermLabour),
        "Manual Removal of Placenta": formatFemaleOnly(manualRemovalOfPlacenta),
        "Post-Partum Hemorrhage (PPH)": formatFemaleOnly(postPartumHemorrhage),
        "Premature Rupture of Membrane (PROM)": formatFemaleOnly(prematureRuptureOfMembrane),
        "Ante Partum Hemorrhage (APH)": formatFemaleOnly(antePartumHemorrhage),
        "Placenta Previa": formatFemaleOnly(placentaPrevia),
        "Abruptio Placenta": formatFemaleOnly(abruptioPlacenta),
        "Pre-Eclampsia": formatFemaleOnly(preEclampsia),
        "Eclampsia": formatFemaleOnly(eclampsia),
        "Maternal Death": formatFemaleOnly([{ count: totalMaternalDeath }]),
        "Pregnancy Induced Hypertension (PIH)": formatFemaleOnly(pregnancyInducedHypertension),
        "MVA (Abortion)": formatFemaleOnly(mva),
        "Missed": formatFemaleOnly(missedAbortion),
        "Induced": formatFemaleOnly(inducedAbortion),
        "Criminal": formatFemaleOnly(criminalAbortion),
        
        // OBSTETRIC FISTULA SERVICES
        "New cases (Women presenting with Fistula)": formatFemaleOnly(newFistulaCases),
        "Admitted Fistula cases": formatFemaleOnly(admittedFistulaCases),
        "First Repair": formatFemaleOnly(firstRepair),
        "Second Repair": formatFemaleOnly(secondRepair),
        "Surgery for Fistula repair": formatFemaleOnly(surgeryForFistulaRepair),
        "Discharges after Fistula surgery": formatFemaleOnly(dischargesAfterFistulaSurgery),
        "Closed and dry Fistula at discharge": formatFemaleOnly(closedAndDryFistulaAtDischarge)
      };
    }
    else if(querytype == summary[23]){
      // Eye Condition Report
      const { eyeConditionPipeline } = eyeConditionReports(startdate, enddate);
      const eyeConditionRawData = await readeyeconditionaggregate(eyeConditionPipeline);
      
      // Format the raw data into the required structure
      const eyeConditionFormatted = formatEyeConditionReport(eyeConditionRawData);
      
      // Convert the conditions object to an array (data is already properly formatted)
      const conditionsArray = Object.keys(eyeConditionFormatted).sort().map(diagnosis => ({
        diagnosis: diagnosis,
        data: eyeConditionFormatted[diagnosis]
      }));
      
      // Create the final report structure
      queryresult = {
        diagnosis: conditionsArray,
        summary: {
          totalDiagnoses: conditionsArray.length,
          totalPatients: eyeConditionRawData.reduce((sum: number, item: any) => sum + (item.count || 0), 0)
        }
      };
    }
    else if(querytype == summary[24]){
      // Disease Cases Report
      const { diseaseCasesPipeline } = diseaseCasesReports(startdate, enddate);
      const diseaseCasesRawData = await readappointmentaggregate(diseaseCasesPipeline);
      
      // Format the raw data - only showing diseases with actual data
      const diseaseCasesFormatted = formatDiseaseCasesReport(diseaseCasesRawData, []);
      
      // Create the final report structure
      queryresult = {
        diseases: diseaseCasesFormatted,
        summary: {
          totalDiseases: diseaseCasesFormatted.length,
          totalCases: diseaseCasesFormatted.reduce((sum: number, item: any) => sum + (item.total || 0), 0),
          totalMortality: diseaseCasesFormatted.reduce((sum: number, item: any) => sum + (item.mortality || 0), 0)
        }
      };
    }
    else if(querytype == summary[25]){
      // Mortality Report by Age Groups
      const [
        mortality0to28Days,
        mortality29Daysto11Months,
        mortality12to59Months,
        mortality5to9Years,
        mortality10to19Years,
        mortality20PlusYears
      ] = await Promise.all([
        readmortalityregisteraggregate(mortality0to28DaysPipeline),
        readmortalityregisteraggregate(mortality29Daysto11MonthsPipeline),
        readmortalityregisteraggregate(mortality12to59MonthsPipeline),
        readmortalityregisteraggregate(mortality5to9YearsPipeline),
        readmortalityregisteraggregate(mortality10to19YearsPipeline),
        readmortalityregisteraggregate(mortality20PlusYearsPipeline)
      ]);

      queryresult = {
        "0-28 days": formatRow(mortality0to28Days),
        "29d-11mths": formatRow(mortality29Daysto11Months),
        "12-59mths": formatRow(mortality12to59Months),
        "5-9yrs": formatRow(mortality5to9Years),
        "10-19yrs": formatRow(mortality10to19Years),
        "20+yrs": formatRow(mortality20PlusYears)
      };
    }
    else if(querytype == summary[26]){
      // Maternal Mortality Report by Age Groups
      const [
        maternalMortalityUnder20,
        maternalMortality20to34,
        maternalMortality35Plus
      ] = await Promise.all([
        readmortalityregisteraggregate(maternalMortalityUnder20Pipeline),
        readmortalityregisteraggregate(maternalMortality20to34Pipeline),
        readmortalityregisteraggregate(maternalMortality35PlusPipeline)
      ]);

      // Helper function to format female-only maternal mortality data
      const formatMaternalRow = (data: any[]) => {
        const count = data[0]?.count || 0;
        return { female: count, total: count };
      };

      queryresult = {
        "under20yrs": formatMaternalRow(maternalMortalityUnder20),
        "20-34yrs": formatMaternalRow(maternalMortality20to34),
        "35+yrs": formatMaternalRow(maternalMortality35Plus)
      };
    }
    else if(querytype == summary[27]){
      // Causes of Deaths Report
      const [
        neonatalDeathPrematurity,
        neonatalDeathTetanus,
        neonatalDeathMalformation,
        neonatalDeathOther,
        underFiveDeathMalaria,
        underFiveDeathPneumonia,
        underFiveDeathMalnutrition,
        underFiveDeathOther
      ] = await Promise.all([
        readmortalityregisteraggregate(neonatalDeathPrematurityPipeline),
        readmortalityregisteraggregate(neonatalDeathTetanusPipeline),
        readmortalityregisteraggregate(neonatalDeathMalformationPipeline),
        readmortalityregisteraggregate(neonatalDeathOtherPipeline),
        readmortalityregisteraggregate(underFiveDeathMalariaPipeline),
        readmortalityregisteraggregate(underFiveDeathPneumoniaPipeline),
        readmortalityregisteraggregate(underFiveDeathMalnutritionPipeline),
        readmortalityregisteraggregate(underFiveDeathOtherPipeline)
      ]);

      queryresult = {
        neonatalDeaths: {
          "Prematurity": neonatalDeathPrematurity[0]?.count || 0,
          "Neonatal Tetanus": neonatalDeathTetanus[0]?.count || 0,
          "Congenital Malformation": neonatalDeathMalformation[0]?.count || 0,
          "Others": neonatalDeathOther[0]?.count || 0
        },
        underFiveDeaths: {
          "Malaria": underFiveDeathMalaria[0]?.count || 0,
          "Pneumonia": underFiveDeathPneumonia[0]?.count || 0,
          "Malnutrition": underFiveDeathMalnutrition[0]?.count || 0,
          "Others": underFiveDeathOther[0]?.count || 0
        }
      };
    }
    else if(querytype == summary[28]){
      // Newborn Health (Outcome of Pregnancy) Report
      const [
        liveBirthsLowWeight,
        liveBirthsNormalWeight,
        freshStillBirthsCount,
        maceratedStillBirthsCount
      ] = await Promise.all([
        readthirdstageLabouraggregate(liveBirthsLowWeightPipeline),
        readthirdstageLabouraggregate(liveBirthsNormalWeightPipeline),
        readthirdstageLabouraggregate(freshStillBirthsCountPipeline),
        readthirdstageLabouraggregate(maceratedStillBirthsCountPipeline)
      ]);

      queryresult = {
        liveBirths: {
          "under2.5kg": formatRow(liveBirthsLowWeight),
          "≥2.5kg": formatRow(liveBirthsNormalWeight)
        },
        stillBirths: {
          "Fresh Still Births (FSB)": freshStillBirthsCount[0]?.count || 0,
          "Macerated Still Births (MSB)": maceratedStillBirthsCount[0]?.count || 0
        }
      };
    }
    else if(querytype == summary[29]){
      // Birth Registration Report
      const [
        childrenUnder1YearRegistered,
        birthCertificatesIssued,
        birthCertificatesCollected
      ] = await Promise.all([
        readbirthregisteraggregate(childrenUnder1YearRegisteredPipeline),
        readbirthregisteraggregate(birthCertificatesIssuedPipeline),
        readbirthregisteraggregate(birthCertificatesCollectedPipeline)
      ]);

      queryresult = {
        "Children Under 1 Year Registered": formatRow(childrenUnder1YearRegistered),
        "Birth Certificates Issued": formatRow(birthCertificatesIssued),
        "Birth Certificates Collected": formatRow(birthCertificatesCollected)
      };
    }
    else{
      return next(new ApiError(400,`Query type ${configuration.error.errorisrequired}`))
    }
  //}

    

    res.json({ queryresult, status: true });
    


  
 
})


/////////////////reports for
