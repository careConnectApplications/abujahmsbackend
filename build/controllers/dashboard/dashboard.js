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
//get all users
function dashboard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _id } = (req.user).user;
            const user = yield (0, users_1.readone)({ _id });
            const appointment = yield (0, appointment_1.readallappointmentfirstfive)({ status: config_1.default.status[9], doctor: _id }, {}, 'patient', 'doctor', 'payment');
            let aggregatequery = [{
                    $lookup: {
                        from: 'labs',
                        localField: 'lab',
                        foreignField: '_id',
                        as: 'lab'
                    }
                },
                {
                    $match: { doctor: _id } // Filter payment
                }
            ];
            const lab = yield (0, appointment_1.modifiedreadallappointment)({}, aggregatequery);
            res.status(200).json({
                queryresult: { user, appointment, lab },
                status: true
            });
        }
        catch (e) {
            res.status(403).json({ status: false, msg: e.message });
        }
    });
}
