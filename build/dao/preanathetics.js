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
exports.readallpreanathetics = readallpreanathetics;
exports.createpreanathetics = createpreanathetics;
exports.readonepreanathetics = readonepreanathetics;
exports.updatepreanathetics = updatepreanathetics;
exports.updatepreanatheticsquery = updatepreanatheticsquery;
const preanatheticsform_1 = __importDefault(require("../models/preanatheticsform"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallpreanathetics(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const preanatheticsdetails = yield preanatheticsform_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalpreanatheticsdetails = yield preanatheticsform_1.default.find(query).countDocuments();
            return { preanatheticsdetails, totalpreanatheticsdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createpreanathetics(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const preanathetics = new preanatheticsform_1.default(input);
            return yield preanathetics.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonepreanathetics(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield preanatheticsform_1.default.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatepreanathetics(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const preanathetics = yield preanatheticsform_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!preanathetics) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return preanathetics;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatepreanatheticsquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const preanathetics = yield preanatheticsform_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!preanathetics) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return preanathetics;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
