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
const maternity_1 = require("../../utils/reporting/maternity");
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
<<<<<<< HEAD
        var { querytype } = req.params;
=======
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
                $match: { $and: [{ paymentcategory: querygroup }, { createdAt: { $gt: startdate, $lt: enddate } }] }
            }
        ];
        //admission
        //referedward
        //status
        //appointment
        //clinic
        /*
        patient: {
              type: Schema.Types.ObjectId,
              ref: "Patientsmanagement",
              default: null,
            },
        
            referedward:
          {
            type: Schema.Types.ObjectId,
            ref: "Wardmanagement",
            default: null,
          },
        */
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
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23;
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
    const { liveBirthPipeline, freshStillBirthPipeline, maceratedStillBirthPipeline, asphyxiaPipeline, lowBirthWeightPipeline, macrosomicBabiesPipeline, earlyNeoNatalDeathPipeline, bornBeforeArrivalPipeline, preMaturityPipeline, neoNatalDeathPipeline, bookedCasesPipeline, unbookedCasesPipeline, svdPipeline, vacuumDeliveryPipeline, forcepsDeliveryPipeline, electiveCaesareanPipeline, emergencyCaesareanPipeline, svdFromSecondStagePipeline, csFromSecondStagePipeline, twinDeliveryPipeline, tripletDeliveryPipeline, quadrupletDeliveryPipeline, breechPresentationPipeline, inductionOfLabourPipeline, pretermLabourPipeline, manualRemovalOfPlacentaPipeline, postPartumHemorrhagePipeline, prematureRuptureOfMembranePipeline, antePartumHemorrhagePipeline, placentaPreviaPipeline, abruptioPlacentaPipeline, preEclampsiaPipeline, eclampsiaPipeline, maternalDeathPipeline, maternalDeathFromMortalityPipeline, pregnancyInducedHypertensionPipeline, mvaPipeline, missedAbortionPipeline, inducedAbortionPipeline, criminalAbortionPipeline, newFistulaCasesPipeline, admittedFistulaCasesPipeline, firstRepairPipeline, secondRepairPipeline, surgeryForFistulaRepairPipeline, dischargesAfterFistulaSurgeryPipeline, closedAndDryFistulaAtDischargePipeline } = (0, maternity_1.maternityreports)(startdate, enddate);
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
<<<<<<< HEAD
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
=======
              },
              {
                $addFields: {
                  firstNonNullEmail: { $arrayElemAt: ["$emails", 0] }
                }
              },
              {
                $project: { emails: 0 }
              }
            */
            {
                $group: {
                    _id: "$cashieremail", // Group by product
                    totalAmount: { $sum: "$amount" },
                    cashierid: { $first: "$cashierid" },
                    tempcashiername: {
                        $push: {
                            $cond: [{ $ne: ["$cashiername", null] }, "$cashiername", "$$REMOVE"]
                        }
                    },
                    //cashiername:{$first:"$cashiername"}
                }
            },
            {
                $addFields: {
                    cashiername: { $arrayElemAt: ["$tempcashiername", 0] }
                }
            },
            {
                $project: {
                    cashieremail: "$_id",
                    cashiername: 1,
                    totalAmount: 1,
                    cashierid: 1,
                    status: config_1.default.status[3],
                    _id: 0
                }
            }
        ];
        const cashieraggregatepaidgrandtotal = [
            {
                $match: { $and: [{ status: config_1.default.status[3] }, { createdAt: { $gt: startdate, $lt: enddate } }] }
            },
            {
                $group: {
                    _id: null, // Group by product
                    grandtotalAmount: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    grandtotalAmount: 1,
                    _id: 0
                }
            }
        ];
        //5 , 6 ,9
        const appointmentaggregatescheduled = [
            {
                $match: { $and: [{ status: config_1.default.status[5] }, {
                            appointmentdate: { $gt: startdate, $lt: enddate }
                        }] }
            },
            {
                $group: {
                    _id: "$clinic", // Group by product
                    Numberofappointment: { $sum: 1 },
                }
            },
            {
                $project: {
                    clinic: "$_id",
                    Numberofappointment: 1,
                    status: config_1.default.status[5],
                    _id: 0
                }
            }
        ];
        const appointmentaggregatecomplete = [
            {
                $match: { $and: [{ status: config_1.default.status[6] }, {
                            appointmentdate: { $gt: startdate, $lt: enddate }
                        }] }
            },
            {
                $group: {
                    _id: "$clinic", // Group by product
                    Numberofappointment: { $sum: 1 },
                }
            },
            {
                $project: {
                    clinic: "$_id",
                    Numberofappointment: 1,
                    status: config_1.default.status[6],
                    _id: 0
                }
            }
        ];
        const appointmentaggregateinprogress = [
            {
                $match: { $and: [{ status: config_1.default.status[9] }, {
                            appointmentdate: { $gt: startdate, $lt: enddate }
                        }] }
            },
            {
                $group: {
                    _id: "$clinic", // Group by product
                    Numberofappointment: { $sum: 1 },
                }
            },
            {
                $project: {
                    clinic: "$_id",
                    Numberofappointment: 1,
                    status: config_1.default.status[9],
                    _id: 0
                }
            }
        ];
        const appointmentaggregatetotalnumberofappointments = [
            {
                $match: { $or: [{ status: config_1.default.status[5] }, { status: config_1.default.status[6] }, { status: config_1.default.status[9] }], appointmentdate: { $gt: startdate, $lt: enddate } }
            },
            {
                $group: {
                    _id: null, // Group by product
                    GrandTotalNumberofappointment: { $sum: 1 },
                }
            },
            {
                $project: {
                    GrandTotalNumberofappointment: 1,
                    _id: 0
                }
            }
        ];
        //3,5,
        const admissionaggregateadmited = [
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
                $match: { $and: [{ status: config_1.default.admissionstatus[1] }, { referddate: { $gt: startdate, $lt: enddate } }] }
            },
            {
                $group: {
                    _id: "$referedward.wardname", // Group by product
                    Numberofadmission: { $sum: 1 },
                }
            },
            {
                $project: {
                    wardname: "$_id",
                    Numberofadmission: 1,
                    status: config_1.default.admissionstatus[1],
                    _id: 0
                }
            }
        ];
        const admissionaggregatetransfered = [
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
                $match: { $and: [{ status: config_1.default.admissionstatus[3] }, { referddate: { $gt: startdate, $lt: enddate } }] }
            },
            {
                $group: {
                    _id: "$referedward.wardname", // Group by product
                    Numberofadmission: { $sum: 1 },
                }
            },
            {
                $project: {
                    wardname: "$_id",
                    Numberofadmission: 1,
                    status: config_1.default.admissionstatus[3],
                    _id: 0
                }
            }
        ];
        const admissionaggregatedischarged = [
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
                $match: { $and: [{ status: config_1.default.admissionstatus[5] }, { referddate: { $gt: startdate, $lt: enddate } }] }
            },
            {
                $group: {
                    _id: "$referedward.wardname", // Group by product
                    Numberofadmission: { $sum: 1 },
                }
            },
            {
                $project: {
                    wardname: "$_id",
                    Numberofadmission: 1,
                    status: config_1.default.admissionstatus[5],
                    _id: 0
                }
            }
        ];
        const admissionaggregatetotalnumberofadmissions = [
            {
                $match: { $or: [{ status: config_1.default.admissionstatus[1] }, { status: config_1.default.admissionstatus[3] }, { status: config_1.default.admissionstatus[5] }], referddate: { $gt: startdate, $lt: enddate } }
            },
            {
                $group: {
                    _id: null, // Group by product
                    TotalNumberofadmission: { $sum: 1 },
                }
            },
            {
                $project: {
                    TotalNumberofadmission: 1,
                    _id: 0
                }
            }
        ];
        //procedure aggregate
        //9, 7
        const procedureaggregatepaid = [
            {
                $lookup: {
                    from: "payments",
                    localField: "payment",
                    foreignField: "_id",
                    as: "payment",
                },
            },
            {
                $unwind: {
                    path: "$payment",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: { "payment.status": config_1.default.status[3], createdAt: { $gt: startdate, $lt: enddate } }
            },
            {
                $group: {
                    _id: "$clinic", // Group by product
                    Numberofprocedures: { $sum: 1 },
                    totalAmount: { $sum: "$payment.amount" }
                }
            },
            {
                $project: {
                    clinic: "$_id",
                    Numberofprocedures: 1,
                    totalAmount: 1,
                    _id: 0
                }
            }
        ];
        const totalprocedureaggregate = [
            {
                $lookup: {
                    from: "payments",
                    localField: "payment",
                    foreignField: "_id",
                    as: "payment",
                },
            },
            {
                $unwind: {
                    path: "$payment",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: { "payment.status": config_1.default.status[3], createdAt: { $gt: startdate, $lt: enddate } }
            },
            {
                $group: {
                    _id: null, // Group by product
                    TotalNumberofprocedures: { $sum: 1 },
                    GrandtotalAmount: { $sum: "$payment.amount" }
                }
            },
            {
                $project: {
                    TotalNumberofprocedures: 1,
                    GrandtotalAmount: 1,
                    _id: 0
                }
            }
        ];
        //clinical aggregate
        const clinicalaggregate = [
            {
                $match: { appointmentdate: { $gt: startdate, $lt: enddate } }
            },
            {
                $group: {
                    _id: {
                        $ifNull: ["$clinicalencounter.diagnosisicd10", "No Diagnosis"] // Group by product
                    },
                    Numberofappointment: { $sum: 1 },
                }
            },
            {
                $project: {
                    diagnosis: "$_id",
                    Numberofappointment: 1,
                    _id: 0
                }
            }
        ];
        const aggregatebyhmo = [
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
                $match: { $and: [
                        {
                            "patient.isHMOCover": config_1.default.ishmo[1]
                        },
                        { createdAt: { $gt: startdate, $lt: enddate } }
                    ]
                }
            },
            {
                $group: {
                    _id: { $ifNull: ["$patient.HMOName", "HMO Not Found"] },
                    //"$patient.HMOName",                // Group by product
                    TotalNumber: { $sum: 1 },
                }
            },
            {
                $project: {
                    HMOName: "$_id",
                    TotalNumber: 1,
                    _id: 0
                }
            }
        ];
        ///////procedure ////////
        const appointmentaggregatebyhmo = [
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
                $match: { $and: [
                        {
                            "patient.isHMOCover": config_1.default.ishmo[1]
                        },
                        { appointmentdate: { $gt: startdate, $lt: enddate } }
                    ]
                }
            },
            {
                $group: {
                    _id: { $ifNull: ["$patient.HMOName", "HMO Not Found"] },
                    //"$patient.HMOName",                // Group by product
                    TotalNumber: { $sum: 1 },
                }
            },
            {
                $project: {
                    HMOName: "$_id",
                    TotalNumber: 1,
                    _id: 0
                }
            }
        ];
        const nutritionaggregatechildren0to59thatreceivednutirtion = [
            {
                $match: { createdAt: { $gt: startdate, $lt: enddate } }
            },
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
                $group: {
                    _id: {
                        ageinmonths: "$ageinmonths",
                        typeofvisit: "$typeofvisit",
                        gender: "$patient.gender"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 } // Optional: sort descending by count
            },
            {
                $project: {
                    parameters: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ];
        const nutritionaggregatechildren0to59growingwell = [
            {
                $match: { $and: [{ createdAt: { $gt: startdate, $lt: enddate } }, { growthaccordingtothechildhealthcard: config_1.default.growthaccordingtothechildhealthcard[0] }] }
                //growthaccordingtothechildhealthcard
            },
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
                $group: {
                    _id: {
                        gender: "$patient.gender"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 } // Optional: sort descending by count
            },
            {
                $project: {
                    parameters: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ];
        const nutritionaggregatechildren0to5exclusivebreadstfeeding = [
            {
                $match: { $and: [{ createdAt: { $gt: startdate, $lt: enddate } }, { infactandyoungchildfeeding: config_1.default.infactandyoungchildfeeding[0] }, { ageinmonths: config_1.default.ageinmonths[0] }] }
            },
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
                $group: {
                    _id: {
                        gender: "$patient.gender"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 } // Optional: sort descending by count
            },
            {
                $project: {
                    parameters: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ];
        const nutritionaggregatechildren0to59givenvitaminasupplement = [
            {
                $match: { $and: [{ createdAt: { $gt: startdate, $lt: enddate } }] }
            },
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
                $group: {
                    _id: {
                        gender: "$patient.gender",
                        vitaminasupplement: "$vitaminasupplement"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 } // Optional: sort descending by count
            },
            {
                $project: {
                    parameters: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ];
        const nutritionaggregatechildren12to59receiveddeworming = [
            {
                $match: { $and: [{ createdAt: { $gt: startdate, $lt: enddate } }, { deworming: { $ne: null } }] }
            },
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
                $group: {
                    _id: {
                        gender: "$patient.gender"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 } // Optional: sort descending by count
            },
            {
                $project: {
                    parameters: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ];
        //children12to59receiveddeworming
        //console.log("//////////", querytype);
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
            //clinicalaggregate
            //"hmoappointmentaggregate","hmoradiologyreport"];
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
        else {
            throw new Error(`querytype ${config_1.default.error.errorisrequired}`);
        }
        res.json({ queryresult, status: true });
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
    else if (querytype == summary[22]) {
        // MATERNITY RETURN Report
        const [
        // Babies Data
        liveBirth, freshStillBirth, maceratedStillBirth, asphyxia, lowBirthWeight, macrosomicBabies, earlyNeoNatalDeath, bornBeforeArrival, preMaturity, neoNatalDeath, 
        // Mothers Data - Booking Status  
        bookedCases, unbookedCases, 
        // Type of Delivery
        svd, vacuumDelivery, forcepsDelivery, electiveCaesarean, emergencyCaesarean, 
        // Also check SecondStageLabour
        svdFromSecondStage, csFromSecondStage, 
        // Multiple Gestation
        twinDelivery, tripletDelivery, quadrupletDelivery, 
        // Obstetric Complications
        breechPresentation, inductionOfLabour, inductionFromFirstStage, pretermLabour, manualRemovalOfPlacenta, postPartumHemorrhage, prematureRuptureOfMembrane, antePartumHemorrhage, placentaPrevia, abruptioPlacenta, preEclampsia, eclampsia, maternalDeath, maternalDeathFromMortality, pregnancyInducedHypertension, mva, missedAbortion, inducedAbortion, criminalAbortion, 
        // Obstetric Fistula Services
        newFistulaCases, admittedFistulaCases, firstRepair, secondRepair, surgeryForFistulaRepair, dischargesAfterFistulaSurgery, closedAndDryFistulaAtDischarge] = yield Promise.all([
            // Babies Data
            (0, reports_1.readthirdstageLabouraggregate)(liveBirthPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(freshStillBirthPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(maceratedStillBirthPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(asphyxiaPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(lowBirthWeightPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(macrosomicBabiesPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(earlyNeoNatalDeathPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(bornBeforeArrivalPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(preMaturityPipeline),
            (0, reports_1.readmortalityregisteraggregate)(neoNatalDeathPipeline),
            // Mothers Data
            (0, reports_1.readthirdstageLabouraggregate)(bookedCasesPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(unbookedCasesPipeline),
            // Type of Delivery
            (0, reports_1.readthirdstageLabouraggregate)(svdPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(vacuumDeliveryPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(forcepsDeliveryPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(electiveCaesareanPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(emergencyCaesareanPipeline),
            // Check SecondStageLabour as well
            (0, reports_1.readsecondstageLabouraggregate)(svdFromSecondStagePipeline),
            (0, reports_1.readsecondstageLabouraggregate)(csFromSecondStagePipeline),
            // Multiple Gestation
            (0, reports_1.readthirdstageLabouraggregate)(twinDeliveryPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(tripletDeliveryPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(quadrupletDeliveryPipeline),
            // Obstetric Complications
            (0, reports_1.readthirdstageLabouraggregate)(breechPresentationPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(inductionOfLabourPipeline),
            (0, reports_1.readfirststageLabouraggregate)(inductionOfLabourPipeline), // Also check FirstStageLabour
            (0, reports_1.readthirdstageLabouraggregate)(pretermLabourPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(manualRemovalOfPlacentaPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(postPartumHemorrhagePipeline),
            (0, reports_1.readthirdstageLabouraggregate)(prematureRuptureOfMembranePipeline),
            (0, reports_1.readthirdstageLabouraggregate)(antePartumHemorrhagePipeline),
            (0, reports_1.readthirdstageLabouraggregate)(placentaPreviaPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(abruptioPlacentaPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(preEclampsiaPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(eclampsiaPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(maternalDeathPipeline),
            (0, reports_1.readmortalityregisteraggregate)(maternalDeathFromMortalityPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(pregnancyInducedHypertensionPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(mvaPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(missedAbortionPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(inducedAbortionPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(criminalAbortionPipeline),
            // Obstetric Fistula Services
            (0, reports_1.readthirdstageLabouraggregate)(newFistulaCasesPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(admittedFistulaCasesPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(firstRepairPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(secondRepairPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(surgeryForFistulaRepairPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(dischargesAfterFistulaSurgeryPipeline),
            (0, reports_1.readthirdstageLabouraggregate)(closedAndDryFistulaAtDischargePipeline)
        ]);
        console.log("liveBirt", liveBirth);
        // Helper function to format female-only data
        const formatFemaleOnly = (data) => {
            var _a;
            const count = ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            return { female: count, total: count };
        };
        // Combine SVD from both sources
        const totalSVD = (((_v = svd[0]) === null || _v === void 0 ? void 0 : _v.count) || 0) + (((_w = svdFromSecondStage[0]) === null || _w === void 0 ? void 0 : _w.count) || 0);
        const totalCS = (((_x = electiveCaesarean[0]) === null || _x === void 0 ? void 0 : _x.count) || 0) + (((_y = emergencyCaesarean[0]) === null || _y === void 0 ? void 0 : _y.count) || 0) + (((_z = csFromSecondStage[0]) === null || _z === void 0 ? void 0 : _z.count) || 0);
        // Combine induction of labour from both sources
        const totalInductionOfLabour = (((_0 = inductionOfLabour[0]) === null || _0 === void 0 ? void 0 : _0.count) || 0) + (((_1 = inductionFromFirstStage[0]) === null || _1 === void 0 ? void 0 : _1.count) || 0);
        // Combine maternal death from both sources
        const totalMaternalDeath = (((_2 = maternalDeath[0]) === null || _2 === void 0 ? void 0 : _2.count) || 0) + (((_3 = maternalDeathFromMortality[0]) === null || _3 === void 0 ? void 0 : _3.count) || 0);
        // Calculate composite metrics
        const iufdCount = (((_4 = freshStillBirth[0]) === null || _4 === void 0 ? void 0 : _4.count) || 0) + (((_5 = maceratedStillBirth[0]) === null || _5 === void 0 ? void 0 : _5.count) || 0);
        const perinatalDeathCount = iufdCount + (((_6 = earlyNeoNatalDeath[0]) === null || _6 === void 0 ? void 0 : _6.count) || 0);
        const totalVaginalDeliveries = totalSVD + (((_7 = vacuumDelivery[0]) === null || _7 === void 0 ? void 0 : _7.count) || 0) + (((_8 = forcepsDelivery[0]) === null || _8 === void 0 ? void 0 : _8.count) || 0);
        const totalCaesareanSections = totalCS;
        const totalBirths = liveBirth.reduce((sum, item) => sum + (item.count || 0), 0) + iufdCount;
        const totalDeliveries = totalVaginalDeliveries + totalCaesareanSections;
        queryresult = {
            // BABIES DATA
            "Live Birth": (0, reportingandanalytics_helper_1.formatRow)(liveBirth),
            "Fresh Still Birth": (0, reportingandanalytics_helper_1.formatRow)(freshStillBirth),
            "Macerated Still Birth": (0, reportingandanalytics_helper_1.formatRow)(maceratedStillBirth),
            "Asphyxia": (0, reportingandanalytics_helper_1.formatRow)(asphyxia),
            "Low Birth Weight (<2.5kg)": (0, reportingandanalytics_helper_1.formatRow)(lowBirthWeight),
            "Macrosomic Babies (≥4.5kg)": (0, reportingandanalytics_helper_1.formatRow)(macrosomicBabies),
            "Early Neo Natal Death (death within 7 days of Age)": (0, reportingandanalytics_helper_1.formatRow)(earlyNeoNatalDeath),
            "Born Before Arrival": (0, reportingandanalytics_helper_1.formatRow)(bornBeforeArrival),
            "Pre-Maturity (<34 Weeks)": (0, reportingandanalytics_helper_1.formatRow)(preMaturity),
            "IUFD (Intra Uterine Fetal Death)": {
                male: (((_9 = freshStillBirth.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "male"; })) === null || _9 === void 0 ? void 0 : _9.count) || 0) +
                    (((_10 = maceratedStillBirth.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "male"; })) === null || _10 === void 0 ? void 0 : _10.count) || 0),
                female: (((_11 = freshStillBirth.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "female"; })) === null || _11 === void 0 ? void 0 : _11.count) || 0) +
                    (((_12 = maceratedStillBirth.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "female"; })) === null || _12 === void 0 ? void 0 : _12.count) || 0),
                total: iufdCount
            },
            "Perinatal Death (IUFD + Baby Deaths within 7 Days)": {
                male: (((_13 = freshStillBirth.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "male"; })) === null || _13 === void 0 ? void 0 : _13.count) || 0) +
                    (((_14 = maceratedStillBirth.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "male"; })) === null || _14 === void 0 ? void 0 : _14.count) || 0) +
                    (((_15 = earlyNeoNatalDeath.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "male"; })) === null || _15 === void 0 ? void 0 : _15.count) || 0),
                female: (((_16 = freshStillBirth.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "female"; })) === null || _16 === void 0 ? void 0 : _16.count) || 0) +
                    (((_17 = maceratedStillBirth.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "female"; })) === null || _17 === void 0 ? void 0 : _17.count) || 0) +
                    (((_18 = earlyNeoNatalDeath.find((r) => { var _a; return ((_a = r._id) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "female"; })) === null || _18 === void 0 ? void 0 : _18.count) || 0),
                total: perinatalDeathCount
            },
            "Neo-natal death (Death within 28 days of Age)": (0, reportingandanalytics_helper_1.formatRow)(neoNatalDeath),
            // MOTHERS DATA - BOOKING STATUS
            "Booked Cases": formatFemaleOnly(bookedCases),
            "Unbooked Cases": formatFemaleOnly(unbookedCases),
            // TYPE OF DELIVERY
            "SVD": formatFemaleOnly([{ count: totalSVD }]),
            "Vacuum Delivery": formatFemaleOnly(vacuumDelivery),
            "Forceps Delivery": formatFemaleOnly(forcepsDelivery),
            "Total No of Vaginal Deliveries (VD)": { female: totalVaginalDeliveries, total: totalVaginalDeliveries },
            "Elective Caesarean Section": formatFemaleOnly(electiveCaesarean),
            "Emergency Caesarean Section": formatFemaleOnly([{ count: (((_19 = emergencyCaesarean[0]) === null || _19 === void 0 ? void 0 : _19.count) || 0) + (((_20 = csFromSecondStage[0]) === null || _20 === void 0 ? void 0 : _20.count) || 0) }]),
            "Total No of Caesarean Section Deliveries": { female: totalCaesareanSections, total: totalCaesareanSections },
            // MULTIPLE GESTATION
            "Multiple Gestation": formatFemaleOnly([{ count: (((_21 = twinDelivery[0]) === null || _21 === void 0 ? void 0 : _21.count) || 0) + (((_22 = tripletDelivery[0]) === null || _22 === void 0 ? void 0 : _22.count) || 0) + (((_23 = quadrupletDelivery[0]) === null || _23 === void 0 ? void 0 : _23.count) || 0) }]),
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
    else {
        return next(new errors_1.ApiError(400, `Query type ${config_1.default.error.errorisrequired}`));
    }
    //}
    res.json({ queryresult, status: true });
}));
/////////////////reports for
