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
exports.readalloperationnotes = readalloperationnotes;
exports.createoperationnote = createoperationnote;
exports.readoneoperationnote = readoneoperationnote;
exports.updateoperationnote = updateoperationnote;
exports.updateoperationnotequery = updateoperationnotequery;
const operationnotes_1 = __importDefault(require("../models/operationnotes"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readalloperationnotes(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const operationnotesdetails = yield operationnotes_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totaloperationnotes = yield operationnotes_1.default.find(query).countDocuments();
            return { operationnotesdetails, totaloperationnotes };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createoperationnote(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const operationnote = new operationnotes_1.default(input);
            return yield operationnote.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneoperationnote(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield operationnotes_1.default.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updateoperationnote(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const operationnote = yield operationnotes_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!operationnote) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return operationnote;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updateoperationnotequery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const operationnote = yield operationnotes_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!operationnote) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return operationnote;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
