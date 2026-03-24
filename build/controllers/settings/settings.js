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
exports.settings = void 0;
exports.settingsresponse = settingsresponse;
exports.settingsummaryresponse = settingsummaryresponse;
exports.cashiersettings = cashiersettings;
const reports_1 = require("../../dao/reports");
const config_1 = __importDefault(require("../../config"));
const settings = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //search pharmacy and spread the array
            const query = { type: config_1.default.clinictype[2] };
            //console.log(check2);
            const reports = [
<<<<<<< HEAD
                { querytype: "financialreport" },
                { querytype: "outpatient" },
                { querytype: "inpatient" },
                { querytype: "labreport" },
                { querytype: "procedurereport" },
                { querytype: "pharmacyreport" },
                { querytype: "radiologyreport" },
                { querytype: "immunizationreport" },
                { querytype: "deathreport" },
                // {querytype:"Nutrition",querygroup:[ "Number Of patient Deworked", "Number of Patient Growing Well"]},
            ];
            const summary = ["financialaggregate", "cashieraggregate", "appointmentaggregate", "admissionaggregate", "procedureaggregate", "clinicalaggregate", "hmoaggregate", "nutritionaggregate", "health facility attendance", "inpatient care", "immunization(Antigen received)", "Immunization (Adverse Events Following Immunization, AEFI)", "Family Planning", "inpatients records", "outpatients records", "accident and emergency records", "national health insurance services", "lab investigation report", "radiology diagnosis", "operation", "special consultative", "immunization", "maternity"];
=======
                { querytype: "financialreport", querygroup: ["Appointment", "Lab", "Patient Registration", "Radiology", "Procedure", ...pharmacyNames] },
                { querytype: "appointmentreport", querygroup: clinicNames },
                { querytype: "admissionreport", querygroup: wardNames },
                { querytype: "hmolabreport", querygroup: hmoNames },
                { querytype: "hmoreportforprocedure", querygroup: hmoNames },
                { querytype: "hmoreportforpharmacy", querygroup: hmoNames },
                { querytype: "hmoappointmentreport", querygroup: hmoNames },
                { querytype: "hmoradiologyreport", querygroup: hmoNames },
                { querytype: "secondaryservicereport", querygroup: ["Appointment", "Lab", "Radiology", "Procedure", "All", ...pharmacyNames] },
                // {querytype:"Nutrition",querygroup:[ "Number Of patient Deworked", "Number of Patient Growing Well"]},
            ];
            const summary = ["financialaggregate", "cashieraggregate", "appointmentaggregate", "admissionaggregate", "procedureaggregate", "clinicalaggregate", "hmoaggregate", "nutritionaggregate"];
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
            return { reports, summary };
        }
        catch (error) {
            console.log("error", error);
            throw new Error(error.message);
        }
    });
};
exports.settings = settings;
function settingsresponse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //const {clinicdetails} = await readallclinics({},{"clinic":1, "id":1,"_id":0});
            //console.log("clinic", clinicdetails);
            var setting = yield (0, exports.settings)();
            res.status(200).json({
                querygroupsettings: setting.reports,
                status: true
            });
        }
        catch (e) {
            res.json({ status: false, msg: e.message });
        }
    });
}
function settingsummaryresponse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //const {clinicdetails} = await readallclinics({},{"clinic":1, "id":1,"_id":0});
            //console.log("clinic", clinicdetails);
            var setting = yield (0, exports.settings)();
            res.status(200).json({
                querygroupsettings: setting.summary,
                status: true
            });
        }
        catch (e) {
            res.json({ status: false, msg: e.message });
        }
    });
}
function cashiersettings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cashieraggregatependingpaid = [
                {
                    $match: { cashieremail: { $ne: null } }
                },
                {
                    $group: {
                        _id: "$cashieremail", // Group by product
                    }
                },
                {
                    $project: {
                        cashieremail: "$_id",
                        _id: 0
                    }
                }
            ];
            reports_1.readpaymentaggregate;
            var queryresult = yield (0, reports_1.readpaymentaggregate)(cashieraggregatependingpaid);
            res.status(200).json({
                queryresult,
                status: true
            });
        }
        catch (e) {
            res.json({ status: false, msg: e.message });
        }
    });
}
