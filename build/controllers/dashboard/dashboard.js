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
const config_1 = __importDefault(require("../../config"));
const users_1 = require("../../dao/users");
const appointment_1 = require("../../dao/appointment");
const lab_1 = require("../../dao/lab");
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
