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
exports.createpricemodel = createpricemodel;
exports.readonepricemodel = readonepricemodel;
exports.updatepricemodel = updatepricemodel;
const pricingmodel_1 = __importDefault(require("../models/pricingmodel"));
const config_1 = __importDefault(require("../config"));
function createpricemodel(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pricemodel = new pricingmodel_1.default(input);
            return yield pricemodel.save();
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.errorusercreate);
        }
    });
}
//find one
function readonepricemodel(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield pricingmodel_1.default.findOne(query);
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserread);
        }
    });
}
//update  users
function updatepricemodel(id, reqbody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pricemodel = yield pricingmodel_1.default.findOneAndUpdate({ _id: id }, reqbody, {
                new: true
            });
            if (!pricemodel) {
                //return json  false response
                throw new Error(config_1.default.error.errorinvalidcredentials);
            }
            return pricemodel;
        }
        catch (err) {
            console.log(err);
            throw new Error(config_1.default.error.erroruserupdate);
        }
    });
}
