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
exports.readallservicetype = readallservicetype;
exports.createservicetype = createservicetype;
exports.readoneservicetype = readoneservicetype;
exports.updateservicetype = updateservicetype;
exports.updateservicetypeyquery = updateservicetypeyquery;
exports.createmanyservicetype = createmanyservicetype;
const servicetype_1 = __importDefault(require("../models/servicetype"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallservicetype(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const servicetypedetails = yield servicetype_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalservicetypedetails = yield servicetype_1.default.find(query).countDocuments();
            return { servicetypedetails, totalservicetypedetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createservicetype(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const servicetype = new servicetype_1.default(input);
            return yield servicetype.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneservicetype(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield servicetype_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updateservicetype(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const servicetype = yield servicetype_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!servicetype) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return servicetype;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updateservicetypeyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const servicetype = yield servicetype_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!servicetype) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return servicetype;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
function createmanyservicetype(filterinput, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(input);
            return yield servicetype_1.default.updateOne(filterinput, input, { upsert: true });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
