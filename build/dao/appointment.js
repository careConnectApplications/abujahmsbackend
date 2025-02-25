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
exports.countappointment = countappointment;
exports.modifiedreadallappointment = modifiedreadallappointment;
exports.readallappointmentfirstfive = readallappointmentfirstfive;
exports.readallappointment = readallappointment;
exports.createappointment = createappointment;
exports.readoneappointment = readoneappointment;
exports.updateappointment = updateappointment;
exports.updateappointmentbyquery = updateappointmentbyquery;
const appointment_1 = __importDefault(require("../models/appointment"));
const config_1 = __importDefault(require("../config"));
function countappointment(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield appointment_1.default.find(query).countDocuments();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function modifiedreadallappointment(query, aggregatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var appointmentdetails = yield appointment_1.default.aggregate(aggregatequery);
            const totalappointmentdetails = yield appointment_1.default.find(query).countDocuments();
            return { appointmentdetails, totalappointmentdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
function readallappointmentfirstfive(query, selectquery, populatequery, populatesecondquery, populatethirdquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield appointment_1.default.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).populate(populatethirdquery).sort({ createdAt: -1 }).limit(5);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
//read all patient history
function readallappointment(query, selectquery, populatequery, populatesecondquery, populatethirdquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointmentdetails = yield appointment_1.default.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).populate(populatethirdquery).sort({ createdAt: -1 });
            const totalappointmentdetails = yield appointment_1.default.find(query).countDocuments();
            return { appointmentdetails, totalappointmentdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createappointment(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointment = new appointment_1.default(input);
            return yield appointment.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneappointment(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield appointment_1.default.findOne(query).select(selectquery).populate(populatequery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updateappointment(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointment = yield appointment_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                upsert: true, new: true
            });
            if (!appointment) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return appointment;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updateappointmentbyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const appointment = yield appointment_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!appointment) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return appointment;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
