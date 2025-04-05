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
exports.countpatient = countpatient;
exports.deletePatietsByCondition = deletePatietsByCondition;
exports.readallpatient = readallpatient;
exports.createpatient = createpatient;
exports.readonepatient = readonepatient;
exports.updatepatient = updatepatient;
exports.updatepatientbyanyquery = updatepatientbyanyquery;
exports.updatepatientmanybyquery = updatepatientmanybyquery;
exports.createpatientifnotexit = createpatientifnotexit;
const patientmanagement_1 = __importDefault(require("../models/patientmanagement"));
const otherservices_1 = require("../utils/otherservices");
const config_1 = __importDefault(require("../config"));
function countpatient(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield patientmanagement_1.default.countDocuments(query);
            //return await Appointment.find(query).countDocuments();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
//delete patient
function deletePatietsByCondition(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield patientmanagement_1.default.deleteMany(query);
            return result;
        }
        catch (err) {
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//read all patient history
function readallpatient(query, selectquery, populatequery, populateappointmentquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const patientdetails = yield patientmanagement_1.default.find(query).select(selectquery).populate(populatequery).populate(populateappointmentquery).sort({ createdAt: -1 });
            const totalpatientdetails = yield patientmanagement_1.default.find(query).countDocuments();
            return { patientdetails, totalpatientdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createpatient(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = new patientmanagement_1.default(input);
            return yield user.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonepatient(query, selectquery, populatequery, appoitmentpopulatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield patientmanagement_1.default.findOne(query).select(selectquery).populate(populatequery).populate(appoitmentpopulatequery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  patient by id
function updatepatient(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (reqbody.password) {
                const passwordHash = yield (0, otherservices_1.encrypt)(reqbody.password);
                //re-assign hasshed version of original
                reqbody.password = passwordHash;
            }
            const user = yield patientmanagement_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!user) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return user;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  patient by query
function updatepatientbyanyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const patient = yield patientmanagement_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!patient) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return patient;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
function updatepatientmanybyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payment = yield patientmanagement_1.default.updateMany(query, reqbody, {
                new: true
            });
            if (!payment) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return payment;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
function createpatientifnotexit(filterinput, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(input);
            return patientmanagement_1.default.updateMany(filterinput, input, { upsert: true });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
