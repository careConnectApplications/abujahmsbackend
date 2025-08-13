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
const errors_1 = require("../../errors");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const reports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //paymentcategory
        //cashieremail
        var { querygroup, querytype, startdate, enddate } = req.params;
        if (!querygroup) {
            throw new Error(`querygroup ${config_1.default.error.errorisrequired}`);
        }
        if (!startdate || !enddate) {
            var todaydate = new Date();
            enddate = todaydate;
            startdate = new Date(todaydate.getFullYear(), todaydate.getMonth() - 6, todaydate.getDate());
        }
        else {
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
                $match: { $and: [{ paymentcategory: querygroup }, { updatedAt: { $gt: startdate, $lt: enddate } }] }
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
                $match: { $and: [{ "referedward.wardname": querygroup }, { referddate: { $gt: startdate, $lt: enddate } }] }
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
                $match: { $and: [{ clinic: querygroup }, {
                            appointmentdate: { $gt: startdate, $lt: enddate }
                        }] }
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
                $match: { $and: [{ "patient.HMOName": querygroup }, {
                            createdAt: { $gt: startdate, $lt: enddate }
                        }] }
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
                $match: { $and: [{ "patient.HMOName": querygroup }, {
                            appointmentdate: { $gt: startdate, $lt: enddate }
                        }] }
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
                $match: { $and: [{ "patient.patienttype": config_1.default.patienttype[1] }, { createdAt: { $gt: startdate, $lt: enddate } }] }
            },
            {
                $addFields: {
                    servicetype: {
                        $ifNull: ["$testname", "$appointmenttype"]
                    }
                }
            },
            {
                $project: {
                    servicetype: 1,
                    patient: 1
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
                $match: { $and: [{ "patient.patienttype": config_1.default.patienttype[1] }, { createdAt: { $gt: startdate, $lt: enddate } }] }
            },
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
                $project: {
                    servicetype: 1,
                    patient: 1
                }
            }
        ];
        const patientsecondaryservice = [
            {
                $match: { $and: [{ patienttype: config_1.default.patienttype[1] }, { createdAt: { $gt: startdate, $lt: enddate } }] }
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
                $match: { $and: [{ pharmacy: querygroup }, { "patient.patienttype": config_1.default.patienttype[1] }, { createdAt: { $gt: startdate, $lt: enddate } }] }
            },
            {
                $addFields: {
                    servicetype: "$prescription"
                }
            },
            {
                $project: {
                    servicetype: 1,
                    patient: 1
                }
            }
        ];
        var queryresult;
        //var c = await configuration.settings2();
        let { reports } = yield (0, settings_1.settings)();
        //Financial report
        if (querytype == reports[0].querytype) {
            queryresult = yield (0, reports_1.readpaymentaggregate)(reportbyfinancialreport);
        }
        else if (querytype == reports[1].querytype) {
            queryresult = yield (0, reports_1.readappointmentaggregate)(reportbyappointmentreport);
        }
        else if (querytype == reports[2].querytype) {
            queryresult = yield (0, reports_1.readadmissionaggregate)(reportbyadmissionreport);
        }
        else if (querytype == reports[3].querytype) {
            queryresult = yield (0, reports_1.readlabaggregate)(reportbyhmoreport);
        }
        else if (querytype == reports[4].querytype) {
            queryresult = yield (0, reports_1.readprocedureaggregate)(reportbyhmoreport);
        }
        else if (querytype == reports[5].querytype) {
            queryresult = yield (0, reports_1.readprescriptionaggregate)(reportbyhmoreport);
        }
        else if (querytype == reports[6].querytype) {
            queryresult = yield (0, reports_1.readappointmentaggregate)(appointmentreportbyhmoreport);
        }
        else if (querytype == reports[7].querytype) {
            queryresult = yield (0, reports_1.readradiologyaggregate)(reportbyhmoreport);
        }
        else if (querytype == reports[8].querytype && querygroup == reports[8].querygroup[0]) {
            //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
            queryresult = yield (0, reports_1.readappointmentaggregate)(secondaryservice);
        }
        else if (querytype == reports[8].querytype && querygroup == reports[8].querygroup[1]) {
            //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
            queryresult = yield (0, reports_1.readlabaggregate)(secondaryservice);
        }
        /*
        else if(querytype == reports[8].querytype && querygroup ==reports[8].querygroup[2]){
          //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
          queryresult= await readpatientsmanagementaggregate(patientsecondaryservice);
        
        }
          */
        else if (querytype == reports[8].querytype && querygroup == reports[8].querygroup[2]) {
            //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
            queryresult = yield (0, reports_1.readradiologyaggregate)(secondaryservice);
        }
        else if (querytype == reports[8].querytype && querygroup == reports[8].querygroup[3]) {
            //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
            queryresult = yield (0, reports_1.readprocedureaggregate)(proceduresecondaryservice);
        }
        else if (querytype == reports[8].querytype && querygroup == reports[8].querygroup[4]) {
            const [result1, result2, result3] = yield Promise.all([
                (0, reports_1.readprocedureaggregate)(proceduresecondaryservice),
                (0, reports_1.readradiologyaggregate)(secondaryservice),
                (0, reports_1.readlabaggregate)(secondaryservice),
                (0, reports_1.readappointmentaggregate)(secondaryservice)
            ]);
            queryresult = [...result1, ...result2, ...result3];
            //queryresult= await readprocedureaggregate(proceduresecondaryservice);
        }
        else if (querytype == reports[8].querytype) {
            //querygroup:[ "Appointment", "Lab","Patient Registration","Radiology","Procedure",...pharmacyNames]
            queryresult = yield (0, reports_1.readprescriptionaggregate)(pharmacysecondaryservice);
        }
        else {
            throw new Error(`querytype ${config_1.default.error.errorisrequired}`);
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
            startdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate());
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
    var { querytype, startdate, enddate } = req.params;
    if (!startdate || !enddate) {
        var todaydate = new Date();
        enddate = todaydate;
        startdate = new Date(todaydate.getFullYear(), todaydate.getMonth(), todaydate.getDate());
    }
    else {
        startdate = new Date(startdate);
        enddate = new Date(enddate);
    }
    let { summary } = yield (0, settings_1.settings)();
    const { financialaggregatepaid, financialaggregategrandtotalpaid } = (0, financial_1.financialreports)(startdate, enddate);
    const { cashieraggregatepaid, cashieraggregatepaidgrandtotal } = (0, cashieraggregate_1.cashieraggregatereports)(startdate, enddate);
    const { appointmentaggregatescheduled, appointmentaggregatecomplete, appointmentaggregateinprogress, appointmentaggregatetotalnumberofappointments, clinicalaggregate } = (0, appointmentaggregate_1.appointmentaggregatereports)(startdate, enddate);
    const { admissionaggregateadmited, admissionaggregatetransfered, admissionaggregatedischarged, admissionaggregatetotalnumberofadmissions } = (0, admission_1.admissionaggregatereports)(startdate, enddate);
    const { procedureaggregatepaid, totalprocedureaggregate } = (0, procedure_1.procedureaggregatereports)(startdate, enddate);
    const { nutritionaggregatechildren12to59receiveddeworming, nutritionaggregatechildren0to59givenvitaminasupplement, nutritionaggregatechildren0to5exclusivebreadstfeeding, nutritionaggregatechildren0to59growingwell, nutritionaggregatechildren0to59thatreceivednutirtion } = (0, nutrition_1.nutritionaggregatereports)(startdate, enddate);
    const { appointmentaggregatebyhmo, aggregatebyhmo } = (0, hmo_1.hmoaggregatereports)(startdate, enddate);
    const { heathfacilityoutpatientattendance, heathfacilitygeneralattendance } = (0, healthfacilityattendance_1.heathfacilityattendancereports)(startdate, enddate);
    const { inpatientdischarges } = (0, inpatientcare_1.inpatientattendancereports)(startdate, enddate);
    const { immunizationpipeline, AEFIcasesreported } = (0, immunization_1.immunizationaggregatereports)(startdate, enddate);
    const { newfamilyplanningacceptorsByGender, counselCountByGender, moderncontraceptionbyagegroup, clientsgivenoralpills, totaloralpillcyclesdispensed, emergencyContraceptiveDispensed, injectablesByName, implantsInsertedByType, iudInserted, sterilizationByGender, maleCondomsDistributed, femaleCondomsDistributed, postpartumCounsellingCount, postPartumImplanonInsertions, postPartumJadelleInsertions, postPartumIUDInsertions } = (0, familyplanning_1.familyplanningreports)(startdate, enddate);
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
        console.log("procedure");
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
    else {
        return next(new errors_1.ApiError(400, `querytype ${config_1.default.error.errorisrequired}`));
    }
    res.json({ queryresult, status: true });
}));
//add pharmacy 1 , pharmacy 2
//add agggreate appointbyicnd10
