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
exports.readalltestcomponent = readalltestcomponent;
exports.createtestcomponent = createtestcomponent;
exports.readonetestcomponent = readonetestcomponent;
exports.updatetestcomponent = updatetestcomponent;
exports.updatetestcomponentyquery = updatetestcomponentyquery;
exports.createmanytestcomponent = createmanytestcomponent;
const testcomponents_1 = __importDefault(require("../models/testcomponents"));
const config_1 = __importDefault(require("../config"));
//read all patient history
function readalltestcomponent(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const testcomponentdetails = yield testcomponents_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totaltestcomponentdetails = yield testcomponents_1.default.find(query).countDocuments();
            return { testcomponentdetails, totaltestcomponentdetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createtestcomponent(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('///////////', input);
            const testcomponent = new testcomponents_1.default(input);
            return yield testcomponent.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonetestcomponent(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield testcomponents_1.default.findOne(query).select(selectquery);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  appointment by id
function updatetestcomponent(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const testcomponent = yield testcomponents_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!testcomponent) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return testcomponent;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
//update  appointment by query
function updatetestcomponentyquery(query, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const testcomponent = yield testcomponents_1.default.findOneAndUpdate(query, reqbody, {
                new: true
            });
            if (!testcomponent) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return testcomponent;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
function createmanytestcomponent(filterinput, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(input);
            return yield testcomponents_1.default.updateOne(filterinput, input, { upsert: true });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
