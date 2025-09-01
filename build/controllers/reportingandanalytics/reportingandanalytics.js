"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsummary = exports.cashierreport = exports.reports = void 0;
const config_1 = __importDefault(require("../../config"));
const reports_1 = require("../../dao/reports");
const payment_1 = require("../../dao/payment");
const settings_1 = require("../settings/settings");
const financial_1 = require("../../utils/reporting/financial");
const cashieraggregate_1 = require("../../utils/reporting/cashieraggregate");
const appointmentaggregate_1 = require("../../utils/reporting/appointmentaggregate");
const admission_1 = require("../../utils/reporting/admission");
const procedure_1 = require("../../utils/reporting/procedure");
const nutrition_1 = require("../../utils/reporting/nutrition");
const hmo_1 = require("../../utils/reporting/hmo");
const healthfacilityattendance_1 = require("../../utils/reporting/healthfacilityattendance");
const inpatientcare_1 = require("../../utils/reporting/inpatientcare");
const immunization_1 = require("../../utils/reporting/immunization");
const familyplanning_1 = require("../../utils/reporting/familyplanning");
const labinvestigation_1 = require("../../utils/reporting/labinvestigation");
const radiodiagnosis_1 = require("../../utils/reporting/radiodiagnosis");
const operation_1 = require("../../utils/reporting/operation");
const specialconsultative_1 = require("../../utils/reporting/specialconsultative");
const reportingandanalytics_helper_1 = require("./reportingandanalytics.helper");
const errors_1 = require("../../errors");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
// Utility function to remove empty string values from an object
const reports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { filters } = req.body;
        // Remove empty string values from filters
        filters = (0, reportingandanalytics_helper_1.removeEmptyStrings)(filters);
        console.log("filter", filters);
        //paymentcategory
        //cashieremail
        var { querytype } = req.params;
        var queryresult;
        //var c = await configuration.settings2();
        let { reports } = yield (0, settings_1.settings)();
        //Financial report
        if (querytype == reports[0].querytype) {
            queryresult = yield (0, reports_1.readpaymentaggregate)((0, reportingandanalytics_helper_1.reportbyfinancialreport)(filters));
        }
        else if (querytype == reports[1].querytype) {
            queryresult = yield (0, reports_1.readappointmentaggregate)((0, reportingandanalytics_helper_1.reportbyappointmentreport)(filters));
        }
        else if (querytype == reports[2].querytype) {
            queryresult = yield (0, reports_1.readadmissionaggregate)((0, reportingandanalytics_helper_1.reportbyadmissionreport)(filters));
        }
        else if (querytype == reports[3].querytype) {
            queryresult = yield (0, reports_1.readlabaggregate)((0, reportingandanalytics_helper_1.reportlab)(filters));
        }
        else if (querytype == reports[4].querytype) {
            queryresult = yield (0, reports_1.readprocedureaggregate)((0, reportingandanalytics_helper_1.reportprocedure)(filters));
        }
        else if (querytype == reports[5].querytype) {
            queryresult = yield (0, reports_1.readprescriptionaggregate)((0, reportingandanalytics_helper_1.reportpharmacy)(filters));
        }
        else if (querytype == reports[6].querytype) {
            queryresult = yield (0, reports_1.readradiologyaggregate)((0, reportingandanalytics_helper_1.reportradiology)(filters));
        }
        else if (querytype == reports[7].querytype) {
            queryresult = yield (0, reports_1.readimmunizationaggregate)((0, reportingandanalytics_helper_1.reportimmunization)(filters));
        }
        else if (querytype == reports[8].querytype) {
            queryresult = yield (0, reports_1.readappointmentaggregate)((0, reportingandanalytics_helper_1.reportdeath)(filters));
        }
        else {
            throw new Error(`Query type ${config_1.default.error.errorisrequired}`);
        }
        res.json({ queryresult, status: true });
    }
    catch (e) {
        console.log(e.message);
        res.json({ status: false, msg: e.message });
    }
});
exports.reports = reports;
// cashier reconcillation
const cashierreport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //find cashier with status
        //paymentcategory
        //cashieremail
        var { startdate, enddate, email } = req.params;
        if (!startdate || !enddate) {
            var todaydate = new Date();
            enddate = todaydate;
            startdate = new Date(todaydate.getFullYear(), todaydate.getMonth() - 6, todaydate.getDate());
        }
        else {
            startdate = new Date(startdate);
            enddate = new Date(enddate);
        }
        var query = { cashieremail: email, createdAt: { $gt: startdate, $lt: enddate } };
        var populatequery = 'patient';
        const cashieraggregatependingpaid = [
            {
                $match: { $and: [{ status: config_1.default.status[3] }, { cashieremail: email }, { createdAt: { $gt: startdate, $lt: enddate } }] }
            },
            {
                $group: {
                    _id: "$cashieremail", // Group by product
                    totalAmount: { $sum: "$amount" },
                    cashierid: { $first: "$cashierid" }
                }
            },
            {
                $project: {
                    cashieremail: "$_id",
                    totalAmount: 1,
                    cashierid: 1,
                    status: config_1.default.status[3],
                    _id: 0
                }
            }
        ];
        const queryresult = { paymentrecords: (yield (0, payment_1.readallpayment)(query, populatequery)).paymentdetails, paymentsummary: yield (0, reports_1.readpaymentaggregate)(cashieraggregatependingpaid) };
        res.json({
            queryresult,
            status: true,
        });
        //return total  
    }
    catch (e) {
        res.json({ status: false, msg: e.message });
    }
});
exports.cashierreport = cashierreport;
//report summary
exports.reportsummary = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    var { querytype, startdate, enddate } = req.params;
    if (!startdate || !enddate) {
        var todaydate = new Date();
        enddate = todaydate;
        startdate = new Date(todaydate.getFullYear(), todaydate.getMonth() - 6, todaydate.getDate());
    }
    else {
        startdate = new Date(startdate);
        enddate = new Date(enddate);
    }
    let { summary } = yield (0, settings_1.settings)();
    const { financialaggregatepaid, financialaggregategrandtotalpaid } = (0, financial_1.financialreports)(startdate, enddate);
    const { cashieraggregatepaid, cashieraggregatepaidgrandtotal } = (0, cashieraggregate_1.cashieraggregatereports)(startdate, enddate);
    const { appointmentaggregatescheduled, appointmentaggregatecomplete, appointmentaggregateinprogress, appointmentaggregatetotalnumberofappointments, clinicalaggregate, outpatientdepartmentpipeline, accidentEmergencyRecordsPipeline } = (0, appointmentaggregate_1.appointmentaggregatereports)(startdate, enddate);
    const { admissionaggregateadmited, admissionaggregatetransfered, admissionaggregatedischarged, admissionaggregatetotalnumberofadmissions, inpatientrecordspipeline } = (0, admission_1.admissionaggregatereports)(startdate, enddate);
    const { procedureaggregatepaid, totalprocedureaggregate } = (0, procedure_1.procedureaggregatereports)(startdate, enddate);
    const { nutritionaggregatechildren12to59receiveddeworming, nutritionaggregatechildren0to59givenvitaminasupplement, nutritionaggregatechildren0to5exclusivebreadstfeeding, nutritionaggregatechildren0to59growingwell, nutritionaggregatechildren0to59thatreceivednutirtion } = (0, nutrition_1.nutritionaggregatereports)(startdate, enddate);
    const { appointmentaggregatebyhmo, aggregatebyhmo, insurancePatientsByGenderAndName } = (0, hmo_1.hmoaggregatereports)(startdate, enddate);
    const { heathfacilityoutpatientattendance, heathfacilitygeneralattendance } = (0, healthfacilityattendance_1.heathfacilityattendancereports)(startdate, enddate);
    const { inpatientdischarges } = (0, inpatientcare_1.inpatientattendancereports)(startdate, enddate);
    const { immunizationpipeline, AEFIcasesreported, immunizationByGenderAndVaccination } = (0, immunization_1.immunizationaggregatereports)(startdate, enddate);
    const { newfamilyplanningacceptorsByGender, counselCountByGender, moderncontraceptionbyagegroup, clientsgivenoralpills, totaloralpillcyclesdispensed, emergencyContraceptiveDispensed, injectablesByName, implantsInsertedByType, iudInserted, sterilizationByGender, maleCondomsDistributed, femaleCondomsDistributed, postpartumCounsellingCount, postPartumImplanonInsertions, postPartumJadelleInsertions, postPartumIUDInsertions } = (0, familyplanning_1.familyplanningreports)(startdate, enddate);
    const { labInvestigationPipeline } = (0, labinvestigation_1.labinvestigationreports)(startdate, enddate);
    const { radioDiagnosisPipeline } = (0, radiodiagnosis_1.radiodiagnosisreports)(startdate, enddate);
    const { operationPipeline } = (0, operation_1.operationreports)(startdate, enddate);
    const { specialConsultativePipeline } = (0, specialconsultative_1.specialconsultativereports)(startdate, enddate);
    let queryresult;
    if (querytype == summary[0]) {
        //queryresult = {paid: await readpaymentaggregate(financialaggregatepaid), pendingpayment:await readpaymentaggregate(financialaggregatependingpaid)};
        queryresult = { paid: yield (0, reports_1.readpaymentaggregate)(financialaggregatepaid), grandtotal: yield (0, reports_1.readpaymentaggregate)(financialaggregategrandtotalpaid) };
    }
    else if (querytype == summary[1]) {
        //cashier summary
        queryresult = { paid: yield (0, reports_1.readpaymentaggregate)(cashieraggregatepaid), grandtotal: yield (0, reports_1.readpaymentaggregate)(cashieraggregatepaidgrandtotal) };
    }
    else if (querytype == summary[2]) {
        queryresult = { scheduled: yield (0, reports_1.readappointmentaggregate)(appointmentaggregatescheduled), complete: yield (0, reports_1.readappointmentaggregate)(appointmentaggregatecomplete), inprogress: yield (0, reports_1.readappointmentaggregate)(appointmentaggregateinprogress), totalnumberofappointments: yield (0, reports_1.readappointmentaggregate)(appointmentaggregatetotalnumberofappointments) };
        //appointmentaggregatetotalnumberofappointments
        //appointment summary
    }
    else if (querytype == summary[3]) {
        //wardadmission summary
        queryresult = { admited: yield (0, reports_1.readadmissionaggregate)(admissionaggregateadmited), transfered: yield (0, reports_1.readadmissionaggregate)(admissionaggregatetransfered), discharged: yield (0, reports_1.readadmissionaggregate)(admissionaggregatedischarged), totalnumberofadmissions: yield (0, reports_1.readadmissionaggregate)(admissionaggregatetotalnumberofadmissions) };
    }
    else if (querytype == summary[4]) {
        queryresult = { paid: yield (0, reports_1.readprocedureaggregate)(procedureaggregatepaid), grandtotal: yield (0, reports_1.readprocedureaggregate)(totalprocedureaggregate) };
    }
    else if (querytype == summary[5]) {
        //clinicalaggregate
        queryresult = { clinicalreport: yield (0, reports_1.readappointmentaggregate)(clinicalaggregate) };
    }
    else if (querytype == summary[6]) {
        queryresult = {
            hmolabsummary: yield (0, reports_1.readlabaggregate)(aggregatebyhmo),
            hmoproceduresummary: yield (0, reports_1.readprocedureaggregate)(aggregatebyhmo),
            hmopharmacysummary: yield (0, reports_1.readprescriptionaggregate)(aggregatebyhmo),
            hmoradiologysummary: yield (0, reports_1.readradiologyaggregate)(aggregatebyhmo),
            hmsappointmentsummary: yield (0, reports_1.readappointmentaggregate)(appointmentaggregatebyhmo)
        };
    }
    else if (querytype == summary[7]) {
        const [children0to59thatreceivednutirtion, children0to59growingwell, children0to5exclusivebreadstfeeding, children0to59givenvitaminasupplement, children12to59receiveddeworming] = yield Promise.all([
            (0, reports_1.readnutritionaggregate)(nutritionaggregatechildren0to59thatreceivednutirtion),
            (0, reports_1.readnutritionaggregate)(nutritionaggregatechildren0to59growingwell),
            (0, reports_1.readnutritionaggregate)(nutritionaggregatechildren0to5exclusivebreadstfeeding),
            (0, reports_1.readnutritionaggregate)(nutritionaggregatechildren0to59givenvitaminasupplement),
            (0, reports_1.readnutritionaggregate)(nutritionaggregatechildren12to59receiveddeworming)
        ]);
        queryresult = { children0to59thatreceivednutirtion, children0to59growingwell, children0to5exclusivebreadstfeeding, children0to59givenvitaminasupplement, children12to59receiveddeworming };
    }
    else if (querytype == summary[8]) {
        const [outpatientattendance, generalattendance] = yield Promise.all([(0, reports_1.readappointmentaggregate)(heathfacilityoutpatientattendance), (0, reports_1.readappointmentaggregate)(heathfacilitygeneralattendance)]);
        queryresult = { outpatientattendance, generalattendance };
    }
    else if (querytype == summary[9]) {
        queryresult = yield (0, reports_1.readadmissionaggregate)(inpatientdischarges);
    }
    else if (querytype == summary[10]) {
        queryresult = yield (0, reports_1.readimmunizationaggregate)(immunizationpipeline);
    }
    else if (querytype == summary[11]) {
        const [aeficasesreport] = yield Promise.all([(0, reports_1.readimmunizationaggregate)(AEFIcasesreported)]);
        queryresult = { aeficasesreport };
    }
    else if (querytype == summary[12]) {
        const [newfamilyplanningacceptors, familyplanningclientscounselled, femalesusingmoderncontraception, clientsgivenoralpill, oralpillcyclesdispensed, emergencycontraceptivedispense, injectablesgiven, Implantsinserted, iudInserteds, sterilization, malecondomdistributed, femalecondomdistributed, womencounselledonpostpartumfamilyplanning, postpartumimplanoninserted, postpartumjadelleinserted, postpartumIUDinserted] = yield Promise.all([(0, reports_1.readfamilyaggregate)(newfamilyplanningacceptorsByGender), (0, reports_1.readfamilyaggregate)(counselCountByGender), (0, reports_1.readfamilyaggregate)(moderncontraceptionbyagegroup), (0, reports_1.readfamilyaggregate)(clientsgivenoralpills), (0, reports_1.readfamilyaggregate)(totaloralpillcyclesdispensed), (0, reports_1.readfamilyaggregate)(emergencyContraceptiveDispensed), (0, reports_1.readfamilyaggregate)(injectablesByName), (0, reports_1.readfamilyaggregate)(implantsInsertedByType), (0, reports_1.readfamilyaggregate)(iudInserted), (0, reports_1.readfamilyaggregate)(sterilizationByGender), (0, reports_1.readfamilyaggregate)(maleCondomsDistributed), (0, reports_1.readfamilyaggregate)(femaleCondomsDistributed), (0, reports_1.readfamilyaggregate)(postpartumCounsellingCount), (0, reports_1.readfamilyaggregate)(postPartumImplanonInsertions), (0, reports_1.readfamilyaggregate)(postPartumJadelleInsertions), (0, reports_1.readfamilyaggregate)(postPartumIUDInsertions)]);
        queryresult = { newfamilyplanningacceptors, familyplanningclientscounselled, femalesusingmoderncontraception, clientsgivenoralpill, oralpillcyclesdispensed, emergencycontraceptivedispense, injectablesgiven, Implantsinserted, iudInserteds, sterilization, malecondomdistributed, femalecondomdistributed, womencounselledonpostpartumfamilyplanning, postpartumimplanoninserted, postpartumjadelleinserted, postpartumIUDinserted };
    }
    else if (querytype == summary[13]) {
        const InpatientRecordsreport = yield (0, reports_1.readadmissionaggregate)(inpatientrecordspipeline);
        queryresult = {
            broughtForward: (0, reportingandanalytics_helper_1.formatRow)(InpatientRecordsreport[0].broughtForward),
            newAdmission: (0, reportingandanalytics_helper_1.formatRow)(InpatientRecordsreport[0].newAdmission),
            totalAdmission: (0, reportingandanalytics_helper_1.formatRow)((0, reportingandanalytics_helper_1.mergeCounts)(InpatientRecordsreport[0].broughtForward, InpatientRecordsreport[0].newAdmission)),
            discharges: (0, reportingandanalytics_helper_1.formatRow)(InpatientRecordsreport[0].discharges),
            deaths: (0, reportingandanalytics_helper_1.formatRow)(InpatientRecordsreport[0].deaths),
            referredIn: (0, reportingandanalytics_helper_1.formatRow)(InpatientRecordsreport[0].referredIn),
            referredOut: (0, reportingandanalytics_helper_1.formatRow)(InpatientRecordsreport[0].referredOut)
        };
    }
    else if (querytype == summary[14]) {
        const outpatientdepartmentreport = yield (0, reports_1.readappointmentaggregate)(outpatientdepartmentpipeline);
        queryresult = {
            "New Registration Adult": (0, reportingandanalytics_helper_1.formatRow)(outpatientdepartmentreport[0].newAdult),
            "New Registration Paediatrics": (0, reportingandanalytics_helper_1.formatRow)(outpatientdepartmentreport[0].newPaediatrics),
            "Family Medicine Attendance": (0, reportingandanalytics_helper_1.formatRow)(outpatientdepartmentreport[0].familyMedicine),
            "POPD Attendance": (0, reportingandanalytics_helper_1.formatRow)(outpatientdepartmentreport[0].popd)
        };
    }
    else if (querytype == summary[15]) {
        const accidentEmergencyRecordsReport = yield (0, reports_1.readappointmentaggregate)(accidentEmergencyRecordsPipeline);
        queryresult = {
            "Accident & Emergency Attendance": (0, reportingandanalytics_helper_1.formatRow)(accidentEmergencyRecordsReport[0].accidentAndEmergencyAttendance),
            "Road Traffic Accident (RTA)": (0, reportingandanalytics_helper_1.formatRow)(accidentEmergencyRecordsReport[0].roadTrafficAccident),
            "EPU Attendance": (0, reportingandanalytics_helper_1.formatRow)(accidentEmergencyRecordsReport[0].epuAttendance),
            //"Dressing": formatRow(accidentEmergencyRecordsReport[0].dressing),
            "A & E Death": (0, reportingandanalytics_helper_1.formatRow)(accidentEmergencyRecordsReport[0].aAndEDeath),
            "EPU Death": (0, reportingandanalytics_helper_1.formatRow)(accidentEmergencyRecordsReport[0].epuDeath),
            "Brought in Death (BID)": (0, reportingandanalytics_helper_1.formatRow)(accidentEmergencyRecordsReport[0].broughtInDeath),
            "BID in EPU": (0, reportingandanalytics_helper_1.formatRow)(accidentEmergencyRecordsReport[0].bidInEpu),
            "Outpatients Referred In": (0, reportingandanalytics_helper_1.formatRow)(accidentEmergencyRecordsReport[0].outpatientsReferredIn),
            "Outpatients Referred Out": (0, reportingandanalytics_helper_1.formatRow)(accidentEmergencyRecordsReport[0].outpatientsReferredOut)
        };
    }
    else if (querytype == summary[16]) {
        queryresult = yield (0, reports_1.readpatientsmanagementaggregate)(insurancePatientsByGenderAndName);
    }
    else if (querytype == summary[17]) {
        // Lab Investigation Report - Section F
        const labReport = yield (0, reports_1.readlabaggregate)(labInvestigationPipeline);
        queryresult = {
            "Haematology": (0, reportingandanalytics_helper_1.formatRow)(((_a = labReport[0]) === null || _a === void 0 ? void 0 : _a.hematology) || []),
            "Parasitology": (0, reportingandanalytics_helper_1.formatRow)(((_b = labReport[0]) === null || _b === void 0 ? void 0 : _b.parasitology) || []),
            "Chemistry": (0, reportingandanalytics_helper_1.formatRow)(((_c = labReport[0]) === null || _c === void 0 ? void 0 : _c.chemicalpathology) || []),
            "Microbiology": (0, reportingandanalytics_helper_1.formatRow)(((_d = labReport[0]) === null || _d === void 0 ? void 0 : _d.microbiology) || []),
            "Blood Transfusion": (0, reportingandanalytics_helper_1.formatRow)(((_e = labReport[0]) === null || _e === void 0 ? void 0 : _e.bloodtransfusion) || []),
            "Blood Donation": (0, reportingandanalytics_helper_1.formatRow)(((_f = labReport[0]) === null || _f === void 0 ? void 0 : _f.blooddonation) || []),
            "Histology": (0, reportingandanalytics_helper_1.formatRow)(((_g = labReport[0]) === null || _g === void 0 ? void 0 : _g.histology) || []),
            "Histopathology (Autopsy)": (0, reportingandanalytics_helper_1.formatRow)(((_h = labReport[0]) === null || _h === void 0 ? void 0 : _h.histopathologyAutopsy) || []),
            "Cytology": (0, reportingandanalytics_helper_1.formatRow)(((_j = labReport[0]) === null || _j === void 0 ? void 0 : _j.cytology) || [])
        };
    }
    else if (querytype == summary[18]) {
        // Radio Diagnosis Report - Section G (Simplified by testname and gender)
        const radioReport = yield (0, reports_1.readradiologyaggregate)(radioDiagnosisPipeline);
        // Group the flat results by testname for easier processing
        const groupedByTest = {};
        radioReport.forEach((item) => {
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
            queryresult[testname] = (0, reportingandanalytics_helper_1.formatRow)(groupedByTest[testname]);
        });
    }
    else if (querytype == summary[19]) {
        // Operation Report - Section H
        const operationReport = yield (0, reports_1.readprocedureaggregate)(operationPipeline);
        queryresult = {
            "Major Operation": (0, reportingandanalytics_helper_1.formatRow)(((_k = operationReport[0]) === null || _k === void 0 ? void 0 : _k.majorOperation) || []),
            "Intermediate Operation": (0, reportingandanalytics_helper_1.formatRow)(((_l = operationReport[0]) === null || _l === void 0 ? void 0 : _l.intermediateOperation) || []),
            "Minor Operation": (0, reportingandanalytics_helper_1.formatRow)(((_m = operationReport[0]) === null || _m === void 0 ? void 0 : _m.minorOperation) || []),
            "Circumcision": (0, reportingandanalytics_helper_1.formatRow)(((_o = operationReport[0]) === null || _o === void 0 ? void 0 : _o.circumcision) || [])
        };
    }
    else if (querytype == summary[20]) {
        // Special Consultative Report - Section I
        const specialReport = yield (0, reports_1.readappointmentaggregate)(specialConsultativePipeline);
        // Process appointmentsByClinic data - grouped by clinic and gender
        const clinicData = {};
        if ((_p = specialReport[0]) === null || _p === void 0 ? void 0 : _p.appointmentsByClinic) {
            specialReport[0].appointmentsByClinic.forEach((item) => {
                var _a, _b;
                const clinicName = (_a = item._id) === null || _a === void 0 ? void 0 : _a.clinic;
                if (clinicName) {
                    if (!clinicData[clinicName]) {
                        clinicData[clinicName] = [];
                    }
                    clinicData[clinicName].push({
                        _id: (_b = item._id) === null || _b === void 0 ? void 0 : _b.gender,
                        count: item.count
                    });
                }
            });
        }
        // Format each clinic's results
        queryresult = {};
        // Add all regular appointments grouped by clinic
        Object.keys(clinicData).forEach(clinicName => {
            queryresult[clinicName] = (0, reportingandanalytics_helper_1.formatRow)(clinicData[clinicName]);
        });
        // Add special data sources
        queryresult["Ante-Natal Registration (New)"] = (0, reportingandanalytics_helper_1.formatRow)(((_q = specialReport[0]) === null || _q === void 0 ? void 0 : _q.antenatalRegistrationNew) || []);
        queryresult["Ante-Natal Follow up"] = (0, reportingandanalytics_helper_1.formatRow)(((_r = specialReport[0]) === null || _r === void 0 ? void 0 : _r.antenatalFollowUp) || []);
        queryresult["Dental Clinic"] = (0, reportingandanalytics_helper_1.formatRow)(((_s = specialReport[0]) === null || _s === void 0 ? void 0 : _s.dentalClinic) || []);
        queryresult["Family Planning Attendance (New)"] = (0, reportingandanalytics_helper_1.formatRow)(((_t = specialReport[0]) === null || _t === void 0 ? void 0 : _t.familyPlanningNew) || []);
        queryresult["Family Planning Attendance (Follow-up)"] = (0, reportingandanalytics_helper_1.formatRow)(((_u = specialReport[0]) === null || _u === void 0 ? void 0 : _u.familyPlanningFollowUp) || []);
    }
    else if (querytype == summary[21]) {
        // Immunization Report - Grouped by Gender and Vaccination
        const immunizationReport = yield (0, reports_1.readimmunizationaggregate)(immunizationByGenderAndVaccination);
        // Group the flat results by vaccination for easier processing
        const groupedByVaccination = {};
        immunizationReport.forEach((item) => {
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
            queryresult[vaccination] = (0, reportingandanalytics_helper_1.formatRow)(groupedByVaccination[vaccination]);
        });
    }
    else {
        return next(new errors_1.ApiError(400, `Query type ${config_1.default.error.errorisrequired}`));
    }
    //}
    res.json({ queryresult, status: true });
}));
/////////////////reports for
