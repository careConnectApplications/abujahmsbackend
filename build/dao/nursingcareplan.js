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
exports.readallnursingcareplan = readallnursingcareplan;
exports.createnursingcareplan = createnursingcareplan;
exports.readonenursingcareplan = readonenursingcareplan;
exports.updatenursingcareplan = updatenursingcareplan;
exports.updatenursingcareplanequery = updatenursingcareplanequery;
const nursingcareplan_1 = __importDefault(require("../models/nursingcareplan"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallnursingcareplan(query, selectquery, populatequery, populatesecondquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nursingcareplandetails = yield nursingcareplan_1.default.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
            const totalnursingcareplandetails = yield nursingcareplan_1.default.find(query).countDocuments();
            return { nursingcareplandetails, totalnursingcareplandetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createnursingcareplan(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const nursingcareplan = new nursingcareplan_1.default(input);
            return yield nursingcareplan.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonenursingcareplan(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield nursingcareplan_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
function updatenursingcareplan(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nursingcareplan = yield nursingcareplan_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!nursingcareplan) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return nursingcareplan;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatenursingcareplanequery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nursingcareplan = yield nursingcareplan_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!nursingcareplan) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return nursingcareplan;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
