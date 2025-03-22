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
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
exports.settingsresponse = settingsresponse;
exports.settingsummaryresponse = settingsummaryresponse;
exports.cashiersettings = cashiersettings;
const reports_1 = require("../../dao/reports");
const settings = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clinic = [
                {
                    $group: {
                        _id: "$clinic", // Group by 'userId'
                    }
                },
                {
                    $project: {
                        clinic: "$_id", // Rename _id to userId
                        _id: 0 // Exclude _id
                    }
                }
            ];
            const ward = [
                {
                    $group: {
                        _id: "$wardname", // Group by 'userId'
                    }
                },
                {
                    $project: {
                        wardname: "$_id", // Rename _id to userId
                        _id: 0 // Exclude _id
                    }
                }
            ];
            const wards = yield (0, reports_1.readwardaggregate)(ward);
            const clinics = yield (0, reports_1.readclinicaggregate)(clinic);
            const wardNames = wards.map(ward => ward.wardname);
            const clinicNames = clinics.map(clinicname => clinicname.clinic);
            //console.log(check2);
            const reports = [
                { querytype: "financialreport", querygroup: ["Appointment", "Pharmacy", "Lab", "Patient Registration", "Radiology", "Procedure"] },
                { querytype: "appointmentreport", querygroup: clinicNames },
                { querytype: "admissionreport", querygroup: wardNames }
            ];
            const summary = ["financialaggregate", "cashieraggregate", "appointmentaggregate", "admissionaggregate", "procedureaggregate", "clinicalaggregate"];
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
