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
exports.readallfamilyplannings = readallfamilyplannings;
exports.createfamilyplannings = createfamilyplannings;
exports.readonefamilyplannings = readonefamilyplannings;
exports.updatefamilyplannings = updatefamilyplannings;
exports.updatefamilyplanningquery = updatefamilyplanningquery;
const familyplanning_1 = __importDefault(require("../models/familyplanning"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallfamilyplannings(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const familyplanningsdetails = yield familyplanning_1.default.find(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
            const totalfamilyplanningsdetails = yield familyplanning_1.default.find(query).countDocuments();
            return { familyplanningsdetails, totalfamilyplanningsdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createfamilyplannings(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const familyplannings = new familyplanning_1.default(input);
            return yield familyplannings.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonefamilyplannings(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield familyplanning_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatefamilyplannings(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const familyplanning = yield familyplanning_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!familyplanning) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return familyplanning;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatefamilyplanningquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const familyplanning = yield familyplanning_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!familyplanning) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return familyplanning;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
