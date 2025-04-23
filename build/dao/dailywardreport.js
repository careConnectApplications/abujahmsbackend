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
exports.readalldailywardreport = readalldailywardreport;
exports.createdailywardreports = createdailywardreports;
exports.readonedailywardreports = readonedailywardreports;
exports.updatedailywardreports = updatedailywardreports;
exports.updatedailywardreportquery = updatedailywardreportquery;
const dailywardreport_1 = __importDefault(require("../models/dailywardreport"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readalldailywardreport(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dailywardreportsdetails = yield dailywardreport_1.default.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
            const totaldailywardreportsdetails = yield dailywardreport_1.default.find(query).countDocuments();
            return { dailywardreportsdetails, totaldailywardreportsdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createdailywardreports(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const dailywardreports = new dailywardreport_1.default(input);
            return yield dailywardreports.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonedailywardreports(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield dailywardreport_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatedailywardreports(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dailywardreport = yield dailywardreport_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!dailywardreport) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return dailywardreport;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatedailywardreportquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dailywardreport = yield dailywardreport_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!dailywardreport) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return dailywardreport;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
