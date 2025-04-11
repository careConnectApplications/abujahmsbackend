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
exports.readallpathograph = readallpathograph;
exports.createpathograph = createpathograph;
exports.readonepathograph = readonepathograph;
exports.updatepathograph = updatepathograph;
exports.updatepathographquery = updatepathographquery;
const pathograph_1 = __importDefault(require("../models/pathograph"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallpathograph(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pathographdetails = yield pathograph_1.default.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
            const totalpathographdetails = yield pathograph_1.default.find(query).countDocuments();
            return { pathographdetails, totalpathographdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createpathograph(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pathograph = new pathograph_1.default(input);
            return yield pathograph.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonepathograph(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield pathograph_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
function updatepathograph(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pathograph = yield pathograph_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!pathograph) {
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return pathograph;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatepathographquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pathograph = yield pathograph_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!pathograph) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return pathograph;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
