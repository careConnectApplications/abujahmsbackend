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
exports.readallthearteadmission = readallthearteadmission;
exports.createthearteadmission = createthearteadmission;
exports.readonethearteadmission = readonethearteadmission;
exports.updatethearteadmission = updatethearteadmission;
exports.updatethearteadmissionbyquery = updatethearteadmissionbyquery;
const thearteadmission_1 = __importDefault(require("../models/thearteadmission"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallthearteadmission(query, selectquery, populatequery, populatesecondquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const thearteadmissiondetails = yield thearteadmission_1.default.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery);
            const totalthearteadmissiondetails = yield thearteadmission_1.default.find(query).countDocuments();
            return { thearteadmissiondetails, totalthearteadmissiondetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createthearteadmission(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const thearteadmission = new thearteadmission_1.default(input);
            return yield thearteadmission.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonethearteadmission(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield thearteadmission_1.default.findOne(query).select(selectquery).populate(populatequery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatethearteadmission(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const thearteadmission = yield thearteadmission_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!thearteadmission) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return thearteadmission;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatethearteadmissionbyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const thearteadmission = yield thearteadmission_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!thearteadmission) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return thearteadmission;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
