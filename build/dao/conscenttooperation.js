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
exports.readallconscentooperations = readallconscentooperations;
exports.createconscentooperation = createconscentooperation;
exports.readoneconscentooperation = readoneconscentooperation;
exports.updateconscentooperation = updateconscentooperation;
exports.updateconscentooperationquery = updateconscentooperationquery;
const conscenttooperation_1 = __importDefault(require("../models/conscenttooperation"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readallconscentooperations(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conscentooperationdetails = yield conscenttooperation_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalconscentooperationdetails = yield conscenttooperation_1.default.find(query).countDocuments();
            return { conscentooperationdetails, totalconscentooperationdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createconscentooperation(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const conscentooperation = new conscenttooperation_1.default(input);
            return yield conscentooperation.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneconscentooperation(query, selectquery, populatequery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield conscenttooperation_1.default.findOne(query).select(selectquery).populate(populatequery).sort({ createdAt: -1 });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updateconscentooperation(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conscentooperation = yield conscenttooperation_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!conscentooperation) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return conscentooperation;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updateconscentooperationquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conscentooperation = yield conscenttooperation_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!conscentooperation) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return conscentooperation;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
