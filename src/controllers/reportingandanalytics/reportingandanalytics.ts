
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
import {labinvestigationreports} from "../../utils/reporting/labinvestigation";
import {radiodiagnosisreports} from "../../utils/reporting/radiodiagnosis";
import {operationreports} from "../../utils/reporting/operation";
import {specialconsultativereports} from "../../utils/reporting/specialconsultative";
import {maternityReturnAggregates} from "../../utils/reporting/maternityreturn";
import {facilityAttendanceAggregates} from "../../utils/reporting/facilityattendance";
import {removeEmptyStrings,mergeCounts,formatRow,reportbyappointmentreport,reportbyadmissionreport,reportbyfinancialreport,reportlab,reportprocedure,reportpharmacy,reportradiology,reportimmunization,reportdeath} from "./reportingandanalytics.helper";
import { ApiError } from "../../errors";
import catchAsync from "../../utils/catchAsync";

// Utility function to remove empty string values from an object


export const reports = async (req:any, res:any) => {
try{
  let {filters} = req.body;
  // Remove empty string values from filters
  filters = removeEmptyStrings(filters);
  console.log("filter", filters);
  
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
  queryresult= await readprescriptionaggregate(reportpharmacy(filters));

}

else if(querytype == reports[6].querytype){
  queryresult= await readradiologyaggregate(reportradiology(filters));

}
else if(querytype == reports[7].querytype){
  queryresult= await readimmunizationaggregate(reportimmunization(filters));

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
    
    const {financialaggregatepaid,financialaggregategrandtotalpaid} = financialreports(startdate,enddate);
    const {cashieraggregatepaid,cashieraggregatepaidgrandtotal} = cashieraggregatereports(startdate,enddate);
    const {appointmentaggregatescheduled,appointmentaggregatecomplete,appointmentaggregateinprogress,appointmentaggregatetotalnumberofappointments,clinicalaggregate,outpatientdepartmentpipeline, accidentEmergencyRecordsPipeline} = appointmentaggregatereports(startdate,enddate)
    const {admissionaggregateadmited,admissionaggregatetransfered,admissionaggregatedischarged,admissionaggregatetotalnumberofadmissions,inpatientrecordspipeline} = admissionaggregatereports(startdate,enddate);
    const {procedureaggregatepaid,totalprocedureaggregate} = procedureaggregatereports(startdate, enddate);
    const {nutritionaggregatechildren12to59receiveddeworming,nutritionaggregatechildren0to59givenvitaminasupplement,nutritionaggregatechildren0to5exclusivebreadstfeeding,nutritionaggregatechildren0to59growingwell,nutritionaggregatechildren0to59thatreceivednutirtion} =nutritionaggregatereports(startdate, enddate);
    const {appointmentaggregatebyhmo,aggregatebyhmo,insurancePatientsByGenderAndName} =hmoaggregatereports(startdate, enddate);
    const {heathfacilityoutpatientattendance,heathfacilitygeneralattendance} = heathfacilityattendancereports(startdate, enddate);
    const {inpatientdischarges} = inpatientattendancereports(startdate, enddate);
    const {immunizationpipeline,AEFIcasesreported} = immunizationaggregatereports(startdate, enddate);
    const {newfamilyplanningacceptorsByGender,counselCountByGender,moderncontraceptionbyagegroup,clientsgivenoralpills,totaloralpillcyclesdispensed,emergencyContraceptiveDispensed,injectablesByName,implantsInsertedByType,iudInserted,sterilizationByGender,maleCondomsDistributed,femaleCondomsDistributed,postpartumCounsellingCount,postPartumImplanonInsertions,postPartumJadelleInsertions,postPartumIUDInsertions}=familyplanningreports(startdate, enddate);
    const {labInvestigationPipeline} = labinvestigationreports(startdate, enddate);
    const {radioDiagnosisPipeline} = radiodiagnosisreports(startdate, enddate);
    const {operationPipeline} = operationreports(startdate, enddate);
    const {specialConsultativePipeline} = specialconsultativereports(startdate, enddate);
    const {babiesData, mothersData} = maternityReturnAggregates(startdate, enddate);
    const {totalFacilityAttendance, monthlyAttendanceTrends, departmentAttendance} = facilityAttendanceAggregates(startdate, enddate);
  
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
        "Blood Transfusion": formatRow(labReport[0]?.bloodfransfusion || []),
        "Blood Donation": formatRow(labReport[0]?.blooddonation || []),
        "Histology": formatRow(labReport[0]?.histology || []),
        "Histopathology (Autopsy)": formatRow(labReport[0]?.histopathologyAutopsy || []),
        "Cytology": formatRow(labReport[0]?.cytology || [])
      };
      
    }
    else if(querytype == summary[18]){
      // Radio Diagnosis Report - Section G
      const radioReport = await readradiologyaggregate(radioDiagnosisPipeline);
      queryresult = {
        // Plain X-Ray
        "Plain X-Ray Inpatients": formatRow(radioReport[0]?.plainXrayInpatients || []),
        "Plain X-Ray Outpatients": formatRow(radioReport[0]?.plainXrayOutpatients || []),
        "Plain X-Ray Referral": formatRow(radioReport[0]?.plainXrayReferral || []),
        // Ultrasound
        "Ultrasound Inpatients": formatRow(radioReport[0]?.ultrasoundInpatients || []),
        "Ultrasound Outpatients": formatRow(radioReport[0]?.ultrasoundOutpatients || []),
        "Ultrasound Referral": formatRow(radioReport[0]?.ultrasoundReferral || []),
        // Other scans
        "CT Scan": formatRow(radioReport[0]?.ctScan || []),
        "Mammogram": formatRow(radioReport[0]?.mammogram || []),
        "MRI": formatRow(radioReport[0]?.mri || []),
        // Contrast procedures
        "HSG": formatRow(radioReport[0]?.hsg || []),
        "IVU": formatRow(radioReport[0]?.ivu || []),
        "MCUG": formatRow(radioReport[0]?.mcug || []),
        "RUG": formatRow(radioReport[0]?.rug || []),
        // Other readings
        "ECG": formatRow(radioReport[0]?.ecg || []),
        "Echo": formatRow(radioReport[0]?.echo || [])
      };
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
      const specialReport = await readappointmentaggregate(specialConsultativePipeline);
      queryresult = {
        // Obstetrics & Gynecology
        "Obstetrics & Gynecology Attendance": formatRow(specialReport[0]?.obstetricsGynecologyAttendance || []),
        "Ante-Natal Registration (New)": formatRow(specialReport[0]?.antenatalRegistrationNew || []),
        "Ante-Natal Follow up": formatRow(specialReport[0]?.antenatalFollowUp || []),
        "Post-Natal Attendance": formatRow(specialReport[0]?.postNatalAttendance || []),
        // Internal Medicine (MOPD)
        "Cardiology": formatRow(specialReport[0]?.cardiology || []),
        "Gastroenterology": formatRow(specialReport[0]?.gastroenterology || []),
        "Neurology": formatRow(specialReport[0]?.neurology || []),
        "Nephrology": formatRow(specialReport[0]?.nephrology || []),
        "Endocrinology": formatRow(specialReport[0]?.endocrinology || []),
        "Comprehensive Clinic (New Cases)": formatRow(specialReport[0]?.comprehensiveClinicNew || []),
        "Comprehensive Clinic (Old Cases)": formatRow(specialReport[0]?.comprehensiveClinicOld || []),
        "Dermatology Clinic": formatRow(specialReport[0]?.dermatologyClinic || []),
        "Haematology": formatRow(specialReport[0]?.haematology || []),
        "Dialysis": formatRow(specialReport[0]?.dialysis || []),
        // Surgical Outpatient Clinic (SOPD)
        "Pediatric Surgery Clinic": formatRow(specialReport[0]?.pediatricSurgeryClinic || []),
        "Neuro Surgery Clinic": formatRow(specialReport[0]?.neuroSurgeryClinic || []),
        "Urology Clinic": formatRow(specialReport[0]?.urologyClinic || []),
        "Orthopedic Clinic": formatRow(specialReport[0]?.orthopedicClinic || []),
        "General Surgery Clinic": formatRow(specialReport[0]?.generalSurgeryClinic || []),
        "Plastic Surgery Clinic": formatRow(specialReport[0]?.plasticSurgeryClinic || []),
        // Dental Unit
        "Dental Surgery": formatRow(specialReport[0]?.dentalSurgery || []),
        "Dental Clinic": formatRow(specialReport[0]?.dentalClinic || []),
        "Maxillofacial Surgery": formatRow(specialReport[0]?.maxillofacialSurgery || []),
        // ENT Unit
        "ENT Clinic": formatRow(specialReport[0]?.entClinic || []),
        "ENT Surgery": formatRow(specialReport[0]?.entSurgery || []),
        // Ophthalmology Unit
        "Ophthalmology Clinic": formatRow(specialReport[0]?.ophthalmologyClinic || []),
        "Ophthalmologic Surgery": formatRow(specialReport[0]?.ophthalmologicSurgery || []),
        "Optometric Unit": formatRow(specialReport[0]?.optometricUnit || []),
        // Behavioral/Mental Unit
        "Behavior/Mental Unit Adult": formatRow(specialReport[0]?.behaviorMentalUnitAdult || []),
        "Behavior/Mental Unit Paed": formatRow(specialReport[0]?.behaviorMentalUnitPaed || []),
        "Psychology Counselling": formatRow(specialReport[0]?.psychologyCounselling || []),
        // Other Clinics
        "DOT Clinic (New Cases)": formatRow(specialReport[0]?.dotClinicNew || []),
        "DOT Clinic (Old Cases)": formatRow(specialReport[0]?.dotClinicOld || []),
        "Physiotherapy Unit": formatRow(specialReport[0]?.physiotherapyUnit || []),
        "Nutrition": formatRow(specialReport[0]?.nutritionClinic || []),
        "Paediatric Clinic": formatRow(specialReport[0]?.paediatricClinic || []),
        "Family Planning Attendance (New)": formatRow(specialReport[0]?.familyPlanningNew || []),
        "Family Planning Attendance (Follow-up)": formatRow(specialReport[0]?.familyPlanningFollowUp || [])
      };
    }
    else if(querytype == summary[21]){
      // Maternity Return Report - Section J
      const babyReport = await readappointmentaggregate(babiesData);
      const motherReport = await readappointmentaggregate(mothersData);
      
      queryresult = {
        // Babies Data
        "Live Birth": formatRow(babyReport[0]?.liveBirth || []),
        "Still Birth": formatRow(babyReport[0]?.stillBirth || []),
        "Asphyxia": formatRow(babyReport[0]?.asphyxia || []),
        "Low Birth Weight": formatRow(babyReport[0]?.lowBirthWeight || []),
        "Newborn Death": formatRow(babyReport[0]?.newbornDeath || []),
        "Normal Birth": formatRow(babyReport[0]?.normalBirth || []),
        "Birth Asphyxia With Resuscitation": formatRow(babyReport[0]?.birthAsphyxiaWithResuscitation || []),
        "Preterm Birth": formatRow(babyReport[0]?.pretermBirth || []),
        "Birth Defects": formatRow(babyReport[0]?.birthDefects || []),
        
        // Mothers Data - Booking Status
        "Booked": formatRow(motherReport[0]?.bookingStatus?.booked || []),
        "Unbooked": formatRow(motherReport[0]?.bookingStatus?.unbooked || []),
        
        // Type of Delivery
        "Normal Vaginal Delivery": formatRow(motherReport[0]?.typeOfDelivery?.normalVaginal || []),
        "Assisted Vaginal Delivery": formatRow(motherReport[0]?.typeOfDelivery?.assistedVaginal || []),
        "Caesarean Section": formatRow(motherReport[0]?.typeOfDelivery?.caesarean || []),
        
        // Obstetric Complications
        "PPH": formatRow(motherReport[0]?.obstetricComplications?.pph || []),
        "Eclampsia": formatRow(motherReport[0]?.obstetricComplications?.eclampsia || []),
        "Obstructed Labour": formatRow(motherReport[0]?.obstetricComplications?.obstructedLabour || []),
        "Sepsis": formatRow(motherReport[0]?.obstetricComplications?.sepsis || []),
        "Ruptured Uterus": formatRow(motherReport[0]?.obstetricComplications?.rupturredUterus || []),
        "Retained Placenta": formatRow(motherReport[0]?.obstetricComplications?.retainedPlacenta || []),
        
        // MVA and Fistula Services
        "MVA Services": formatRow(motherReport[0]?.mvaServices || []),
        "Fistula Screening": formatRow(motherReport[0]?.fistulaServices?.screening || []),
        "Fistula Repair": formatRow(motherReport[0]?.fistulaServices?.repair || []),
        "Fistula Rehabilitation": formatRow(motherReport[0]?.fistulaServices?.rehabilitation || []),
        "Maternal Death": formatRow(motherReport[0]?.maternalDeath || [])
      };
    }
    else if(querytype == summary[22]){
      // Total Facility Attendance Report - Section L
      const facilityReport = await readappointmentaggregate(totalFacilityAttendance);
      const monthlyTrends = await readappointmentaggregate(monthlyAttendanceTrends);
      const deptAttendance = await readappointmentaggregate(departmentAttendance);
      
      queryresult = {
        // Total Facility Attendance
        "Total Patients": formatRow(facilityReport[0]?.totalPatients || []),
        "New Patients": formatRow(facilityReport[0]?.newPatients || []),
        "Revisit Patients": formatRow(facilityReport[0]?.revisitPatients || []),
        "Referred In": formatRow(facilityReport[0]?.referredIn || []),
        "Referred Out": formatRow(facilityReport[0]?.referredOut || []),
        "Emergency Visits": formatRow(facilityReport[0]?.emergencyVisits || []),
        "Outpatient Visits": formatRow(facilityReport[0]?.outpatientVisits || []),
        "Inpatient Admissions": formatRow(facilityReport[0]?.inpatientAdmissions || []),
        "Day Case": formatRow(facilityReport[0]?.dayCase || []),
        "Pediatric Attendance": formatRow(facilityReport[0]?.pediatricAttendance || []),
        "Adult Attendance": formatRow(facilityReport[0]?.adultAttendance || []),
        "NHIS Patients": formatRow(facilityReport[0]?.nhisPatients || []),
        "Private Patients": formatRow(facilityReport[0]?.privatePatients || []),
        
        // Monthly Attendance Trends
        "Monthly Trends": monthlyTrends || [],
        
        // Department-wise Attendance
        "Department Attendance": deptAttendance || []
      };
    }
    else{
      return next(new ApiError(400,`Query type ${configuration.error.errorisrequired}`))
    }
  //}

    

    res.json({ queryresult, status: true });
    


  
 
})


/////////////////reports for
