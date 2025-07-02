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
exports.readallvitalsignscores = readallvitalsignscores;
exports.createvitalsignscore = createvitalsignscore;
exports.readonevitalsignscore = readonevitalsignscore;
exports.updatevitalsignscore = updatevitalsignscore;
exports.updatevitalsignscorequery = updatevitalsignscorequery;
const vitalsignscore_1 = __importDefault(require("../models/vitalsignscore"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallvitalsignscores(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vitalsignscoredetails = yield vitalsignscore_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalvitalsignscoredetails = yield vitalsignscore_1.default.find(query).countDocuments();
            return { vitalsignscoredetails, totalvitalsignscoredetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createvitalsignscore(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vitalsignscore = new vitalsignscore_1.default(input);
            return yield vitalsignscore.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonevitalsignscore(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield vitalsignscore_1.default.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatevitalsignscore(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vitalsignscore = yield vitalsignscore_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!vitalsignscore) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return vitalsignscore;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatevitalsignscorequery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vitalsignscore = yield vitalsignscore_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!vitalsignscore) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return vitalsignscore;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
