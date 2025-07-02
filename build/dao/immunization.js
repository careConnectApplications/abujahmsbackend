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
exports.readallimmunization = readallimmunization;
exports.createimmunization = createimmunization;
exports.readoneimmunization = readoneimmunization;
exports.updateimmunization = updateimmunization;
exports.updateimmunizationequery = updateimmunizationequery;
const immunization_1 = __importDefault(require("../models/immunization"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallimmunization(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const immunizationdetails = yield immunization_1.default.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
            const totalimmunizationdetails = yield immunization_1.default.find(query).countDocuments();
            return { immunizationdetails, totalimmunizationdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createimmunization(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const immunization = new immunization_1.default(input);
            return yield immunization.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneimmunization(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield immunization_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
function updateimmunization(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const immunization = yield immunization_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!immunization) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return immunization;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updateimmunizationequery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const immunization = yield immunization_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!immunization) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return immunization;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
