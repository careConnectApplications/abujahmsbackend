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
exports.readalltheatremanagement = readalltheatremanagement;
exports.createtheatremanagement = createtheatremanagement;
exports.readonetheatremanagement = readonetheatremanagement;
exports.updatetheatremanagement = updatetheatremanagement;
exports.updatetheatremanagementbyquery = updatetheatremanagementbyquery;
const theatremanagement_1 = __importDefault(require("../models/theatremanagement"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readalltheatremanagement(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const theatremanagementdetails = yield theatremanagement_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totaltheatremanagementdetails = yield theatremanagement_1.default.find(query).countDocuments();
            return { theatremanagementdetails, totaltheatremanagementdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createtheatremanagement(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const theatremanagement = new theatremanagement_1.default(input);
            return yield theatremanagement.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonetheatremanagement(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield theatremanagement_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  management by id
function updatetheatremanagement(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const theatremanagement = yield theatremanagement_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!theatremanagement) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return theatremanagement;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  bedmanagement by query
function updatetheatremanagementbyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const theatremanagement = yield theatremanagement_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!theatremanagement) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return theatremanagement;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
