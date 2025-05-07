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
exports.readallpreoperativeprevisits = readallpreoperativeprevisits;
exports.createpreoperativeprevisit = createpreoperativeprevisit;
exports.readonepreoperativeprevisit = readonepreoperativeprevisit;
exports.updatepreoperativeprevisit = updatepreoperativeprevisit;
exports.updatepreoperativeprevisitquery = updatepreoperativeprevisitquery;
const preoperativeprevisit_1 = __importDefault(require("../models/preoperativeprevisit"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallpreoperativeprevisits(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const preoperativeprevisitdetails = yield preoperativeprevisit_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalpreoperativeprevisitdetails = yield preoperativeprevisit_1.default.find(query).countDocuments();
            return { preoperativeprevisitdetails, totalpreoperativeprevisitdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createpreoperativeprevisit(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const preoperativeprevisit = new preoperativeprevisit_1.default(input);
            return yield preoperativeprevisit.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonepreoperativeprevisit(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield preoperativeprevisit_1.default.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatepreoperativeprevisit(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const preoperativeprevisit = yield preoperativeprevisit_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!preoperativeprevisit) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return preoperativeprevisit;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatepreoperativeprevisitquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const preoperativeprevisit = yield preoperativeprevisit_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!preoperativeprevisit) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return preoperativeprevisit;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
