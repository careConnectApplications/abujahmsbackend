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
exports.readallhistologyrequests = readallhistologyrequests;
exports.createhistologyrequest = createhistologyrequest;
exports.readonehistology = readonehistology;
exports.updatehistology = updatehistology;
exports.updatehistologyquery = updatehistologyquery;
const histology_1 = __importDefault(require("../models/histology"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallhistologyrequests(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const histologydetails = yield histology_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalhistologydetails = yield histology_1.default.find(query).countDocuments();
            return { histologydetails, totalhistologydetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createhistologyrequest(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const histology = new histology_1.default(input);
            return yield histology.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonehistology(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield histology_1.default.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatehistology(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const histology = yield histology_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!histology) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return histology;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatehistologyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const histology = yield histology_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!histology) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return histology;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
