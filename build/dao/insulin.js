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
exports.readallinsulins = readallinsulins;
exports.createinsulins = createinsulins;
exports.readoneinsulins = readoneinsulins;
exports.updateinsulins = updateinsulins;
exports.updateinsulinquery = updateinsulinquery;
const insulinchart_1 = __importDefault(require("../models/insulinchart"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallinsulins(query, selectquery, populatequery, populatesecondquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const insulindetails = yield insulinchart_1.default.find(query).select(selectquery).populate(populatequery).populate(populatesecondquery).sort({ createdAt: -1 });
            const totalinsulindetails = yield insulinchart_1.default.find(query).countDocuments();
            return { insulindetails, totalinsulindetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createinsulins(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const insulin = new insulinchart_1.default(input);
            return yield insulin.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneinsulins(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield insulinchart_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updateinsulins(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const insulin = yield insulinchart_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!insulin) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return insulin;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updateinsulinquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const insulin = yield insulinchart_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!insulin) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return insulin;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
