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
<<<<<<< HEAD
            throw new Error("Failed to create pricing model");
=======
            throw new Error(config_1.default.error.errorusercreate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
            throw new Error("Failed to retrieve pricing model data");
=======
            throw new Error(config_1.default.error.erroruserread);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
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
<<<<<<< HEAD
            throw new Error("Failed to update pricing model");
=======
            throw new Error(config_1.default.error.erroruserupdate);
>>>>>>> 315460a373f2a6c5e9da62546d3254a1cca47109
        }
    });
}
