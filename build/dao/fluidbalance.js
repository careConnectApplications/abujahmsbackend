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
exports.readallfluidbalances = readallfluidbalances;
exports.createfluidbalances = createfluidbalances;
exports.readonefluidbalances = readonefluidbalances;
exports.updatefluidbalances = updatefluidbalances;
exports.updatefluidbalancequery = updatefluidbalancequery;
exports.createMultifluidbalances = createMultifluidbalances;
const fluidbalance_1 = __importDefault(require("../models/fluidbalance"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallfluidbalances(query, selectquery, populatequery, populatesecondquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fluidbalancesdetails = yield fluidbalance_1.default.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
            const totalfluidbalancesdetails = yield fluidbalance_1.default.find(query).countDocuments();
            return { fluidbalancesdetails, totalfluidbalancesdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createfluidbalances(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const fluidbalances = new fluidbalance_1.default(input);
            return yield fluidbalances.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonefluidbalances(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fluidbalance_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
function updatefluidbalances(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fluidbalance = yield fluidbalance_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!fluidbalance) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return fluidbalance;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatefluidbalancequery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fluidbalance = yield fluidbalance_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!fluidbalance) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return fluidbalance;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
function createMultifluidbalances(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fluidbalance_1.default.create(input);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
