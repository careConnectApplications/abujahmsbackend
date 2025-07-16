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
exports.readalldruggivens = readalldruggivens;
exports.createdruggiven = createdruggiven;
exports.readonedruggiven = readonedruggiven;
exports.updatedruggiven = updatedruggiven;
exports.updatedruggivenquery = updatedruggivenquery;
const druggiven_1 = __importDefault(require("../models/druggiven"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readalldruggivens(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const druggivendetails = yield druggiven_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totaldruggivendetails = yield druggiven_1.default.find(query).countDocuments();
            return { druggivendetails, totaldruggivendetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createdruggiven(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const druggiven = new druggiven_1.default(input);
            return yield druggiven.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonedruggiven(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield druggiven_1.default.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatedruggiven(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const druggiven = yield druggiven_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!druggiven) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return druggiven;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatedruggivenquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const druggiven = yield druggiven_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!druggiven) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return druggiven;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
