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
exports.readallprices = readallprices;
exports.createmanyprice = createmanyprice;
exports.createprice = createprice;
exports.readoneprice = readoneprice;
exports.updateprice = updateprice;
const pricefornewregandappointment_1 = __importDefault(require("../models/pricefornewregandappointment"));
const config_1 = __importDefault(require("../config"));
//read all payment history
function readallprices(query, selectquery) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pricedetails = yield pricefornewregandappointment_1.default.find(query).select(selectquery).sort({ createdAt: -1 });
            const totalpricedetails = yield pricefornewregandappointment_1.default.find(query).countDocuments();
            return { pricedetails, totalpricedetails };
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
;
function createmanyprice(filterinput, input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(input);
            return pricefornewregandappointment_1.default.updateOne(filterinput, input, { upsert: true });
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
function createprice(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = new pricefornewregandappointment_1.default(input);
            return yield user.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readoneprice(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield pricefornewregandappointment_1.default.findOne(query);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  users
function updateprice(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield pricefornewregandappointment_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!user) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return user;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
