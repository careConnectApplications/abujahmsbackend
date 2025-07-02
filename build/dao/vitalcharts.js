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
exports.readallvitalcharts = readallvitalcharts;
exports.createvitalcharts = createvitalcharts;
exports.readonevitalcharts = readonevitalcharts;
exports.updatevitalcharts = updatevitalcharts;
exports.updatevitalyquery = updatevitalyquery;
const vitalcharts_1 = __importDefault(require("../models/vitalcharts"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallvitalcharts(query, selectquery, populatequery, populatesecondquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vitalchartsdetails = yield vitalcharts_1.default.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
            const totalvitalchartsdetails = yield vitalcharts_1.default.find(query).countDocuments();
            return { vitalchartsdetails, totalvitalchartsdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createvitalcharts(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const vitalcharts = new vitalcharts_1.default(input);
            return yield vitalcharts.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonevitalcharts(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield vitalcharts_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatevitalcharts(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vital = yield vitalcharts_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!vital) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return vital;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatevitalyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vital = yield vitalcharts_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!vital) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return vital;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
