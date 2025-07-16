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
exports.readallanc = readallanc;
exports.createanc = createanc;
exports.readoneanc = readoneanc;
exports.updateanc = updateanc;
exports.updateancbyquery = updateancbyquery;
const anc3_1 = __importDefault(require("../models/anc3"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallanc(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ancdetails = yield anc3_1.default.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
            const totalancdetails = yield anc3_1.default.find(query).countDocuments();
            return { ancdetails, totalancdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createanc(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const anc = new anc3_1.default(input);
            return yield anc.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneanc(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield anc3_1.default.findOne(query).select(selectquery).populate(populatequery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updateanc(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const anc = yield anc3_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                upsert: true, new: true
            });
            if (!anc) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return anc;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updateancbyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const anc = yield anc3_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!anc) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return anc;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
