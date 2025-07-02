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
exports.dashboard = dashboard;
exports.newdashboard = newdashboard;
const config_1 = __importDefault(require("../../config"));
const users_1 = require("../../dao/users");
const appointment_1 = require("../../dao/appointment");
const patientmanagement_1 = require("../../dao/patientmanagement");
const admissions_1 = require("../../dao/admissions");
const lab_1 = require("../../dao/lab");
const procedure_1 = require("../../dao/procedure");
const radiology_1 = require("../../dao/radiology");
const reports_1 = require("../../dao/reports");
//get all users
function dashboard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _id } = (req.user).user;
            const user = yield (0, users_1.readone)({ _id });
            const firstfiveinprocressappointment = yield (0, appointment_1.readallappointmentfirstfive)({ status: config_1.default.status[9], doctor: _id }, {}, 'patient', 'doctor', 'payment');
            const firstfivescheduledlab = yield (0, lab_1.readalllablimitfive)({ status: config_1.default.status[5] }, {}, 'patient', 'appointment', 'payment');
            //attended appoitment
            const totalattendedappointment = yield (0, appointment_1.countappointment)({ $or: [{ status: config_1.default.status[9] }, { status: config_1.default.status[6] }] });
            //uplcomming appointment
            const totalschedulesappointment = yield (0, appointment_1.countappointment)({ status: config_1.default.status[5] });
            res.status(200).json({
                queryresult: { user, firstfiveinprocressappointment, firstfivescheduledlab, totalattendedappointment, totalschedulesappointment },
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
function newdashboard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            //number of outpatient // appointment
            let totalnumberofactivepatient = yield (0, patientmanagement_1.countpatient)({ status: config_1.default.status[1] });
            //total admitted patient
            let totaladmittedpatient = yield (0, admissions_1.countadmission)({ $ne: { status: config_1.default.admissionstatus[5] } });
            //totol discharged
            let totaldischargepatient = yield (0, admissions_1.countadmission)({ status: config_1.default.admissionstatus[5] });
            //total pending procedures
            let totalpendingprocedures = yield (0, procedure_1.countprocedure)({ status: config_1.default.status[9] });
            //total number of staffs
            let totalnumberfactiveusers = yield (0, users_1.countuser)({ status: config_1.default.status[1] });
            //total pending appointments
            let totalpendingappointments = yield (0, appointment_1.countappointment)({ status: config_1.default.status[5] });
            //total pending lab apointment
            let totalpendinglabappointment = yield (0, lab_1.countlab)({ status: config_1.default.status[14] });
            //total pedning radiology appointment
            let totalpendingradiologyappointment = yield (0, radiology_1.countradiology)({ status: config_1.default.status[14] });
            // Get the current date and the date for 7 days ago
            const currentDate = new Date();
            const sevenDaysAgo = new Date(currentDate);
            sevenDaysAgo.setDate(currentDate.getDate() - 7); // Subtract 7 days
            const barchartaggregate = [
                {
                    $match: {
                        createdAt: {
                            $gte: sevenDaysAgo, // Greater than or equal to 7 days ago
                            $lte: currentDate, // Less than or equal to the current date
                        },
                    },
                },
                {
                    $addFields: {
                        dayOfWeek: { $dayOfWeek: "$createdAt" } // Adds the day of the week (1 = Sunday, 7 = Saturday)
                    }
                },
                {
                    $group: {
                        _id: "$dayOfWeek", // Group by the day of the week
                        count: { $sum: 1 }, // Count the number of documents for each day of the week
                    }
                },
                {
                    $project: {
                        _id: 0, // Hide the _id field
                        dayOfWeek: "$_id", // Show the day of the week
                        count: 1, // Show the count of documents
                    }
                },
                {
                    $sort: { dayOfWeek: 1 } // Sort by day of the week (1 = Sunday, 2 = Monday, ..., 7 = Saturday)
                }
            ];
            // Map the days of the week to their actual names
            const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
            const appointmentresults = yield (0, reports_1.readappointmentaggregate)(barchartaggregate);
            const admissionresult = yield (0, reports_1.readadmissionaggregate)(barchartaggregate);
            let datax = [];
            for (let i = 0; i < 7; i++) {
                datax.push({
                    name: dayNames[i],
                    OutPatients: ((_a = (appointmentresults.filter(result => result.dayOfWeek == i + 1))[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                    InPatients: ((_b = (admissionresult.filter(result => result.dayOfWeek == i + 1))[0]) === null || _b === void 0 ? void 0 : _b.count) || 0
                });
            }
            res.status(200).json({
                datax,
                totalpendingradiologyappointment,
                totalpendinglabappointment,
                totalpendingappointments,
                totalnumberofactivepatient,
                totaladmittedpatient,
                totaldischargepatient,
                totalpendingprocedures,
                totalnumberfactiveusers,
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
