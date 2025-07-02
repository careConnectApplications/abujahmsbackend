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
exports.readallanaethesias = readallanaethesias;
exports.createanaethesia = createanaethesia;
exports.readoneanaethesia = readoneanaethesia;
exports.updateanaethesia = updateanaethesia;
exports.updateanaethesiaquery = updateanaethesiaquery;
const anaethesia_1 = __importDefault(require("../models/anaethesia"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallanaethesias(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const anaethesiadetails = yield anaethesia_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalanaethesiadetails = yield anaethesia_1.default.find(query).countDocuments();
            return { anaethesiadetails, totalanaethesiadetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createanaethesia(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const anaethesia = new anaethesia_1.default(input);
            return yield anaethesia.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneanaethesia(query, selectquery, populatequery, populatequerysecond) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield anaethesia_1.default.findOne(query).select(selectquery).populate(populatequery).populate(populatequerysecond).sort({ createdAt: -1 });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updateanaethesia(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const anaethesia = yield anaethesia_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!anaethesia) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return anaethesia;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updateanaethesiaquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const anaethesia = yield anaethesia_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!anaethesia) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return anaethesia;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
